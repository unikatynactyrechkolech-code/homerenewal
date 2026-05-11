"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import EditorPanel from "./EditorPanel";

type Override = {
  text: string;
  font_family: string | null;
  font_size: string | null;
  font_weight: string | null;
  color: string | null;
};

type EditorContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  refresh: () => Promise<void>;
  login: (password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  dbConfigured: boolean;
};

const Ctx = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useEditor must be used within EditorProvider");
  return v;
}

/* ── Selektory editovatelných elementů ─────────────────────────── */
const EDITABLE_SELECTORS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "li",
  "button",
  "a",
  "span",
  "label",
  "blockquote",
  "[data-editable]",
].join(",");

function isLeafText(el: Element): boolean {
  // Editujeme jen elementy, jejichž PŘÍMÝ obsah je text (žádné child elementy
  // s vlastním textem). Tím se vyhneme rodičům, kteří jen obalují další text.
  const text = (el.textContent ?? "").trim();
  if (!text) return false;

  for (const child of Array.from(el.children)) {
    const childText = (child.textContent ?? "").trim();
    if (childText.length > 0) return false;
  }
  return true;
}

/** Stabilní klíč: pathname + tag + index v dokumentu mezi stejnými tagy. */
function buildKey(el: Element, pathname: string): string {
  const explicit = el.getAttribute("data-edit-key");
  if (explicit) return explicit;

  const tag = el.tagName.toLowerCase();
  const all = Array.from(document.querySelectorAll(tag));
  const idx = all.indexOf(el);
  return `${pathname}::${tag}:${idx}`;
}

function applyOverride(el: HTMLElement, o: Override) {
  el.textContent = o.text;
  if (o.font_family) el.style.fontFamily = o.font_family;
  if (o.font_size) el.style.fontSize = o.font_size;
  if (o.font_weight) el.style.fontWeight = o.font_weight;
  if (o.color) el.style.color = o.color;
}

export default function EditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbConfigured, setDbConfigured] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});

  const [target, setTarget] = useState<{
    key: string;
    text: string;
    font_family: string | null;
    font_size: string | null;
    font_weight: string | null;
    color: string | null;
    rect: DOMRect;
    el: HTMLElement;
  } | null>(null);

  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;

  /* ── Načti session + overrides při startu ──────────────────────── */
  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        setIsAdmin(!!d.isAdmin);
        setDbConfigured(!!d.dbConfigured);
      })
      .catch(() => {});

    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setOverrides(d.data ?? {}))
      .catch(() => {});
  }, []);

  /* ── Aplikuj overrides na DOM po každé změně cesty / overrides ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => {
      if (!pathname) return;
      const els = document.querySelectorAll<HTMLElement>(EDITABLE_SELECTORS);
      els.forEach((el) => {
        if (!isLeafText(el)) return;
        const key = buildKey(el, pathname);
        const o = overrides[key];
        if (o) applyOverride(el, o);
      });
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname, overrides]);

  /* ── Right-click handler v editMode ────────────────────────────── */
  useEffect(() => {
    if (!isAdmin || !editMode) return;

    function onContextMenu(e: MouseEvent) {
      const path = (e.composedPath?.() ?? []) as Element[];
      // Najdi nejbližší editovatelný leaf
      let chosen: HTMLElement | null = null;
      for (const node of path) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.closest(".hr-editor-panel")) return; // klik v panelu — ignoruj
        if (node.matches(EDITABLE_SELECTORS) && isLeafText(node)) {
          chosen = node;
          break;
        }
      }
      if (!chosen || !pathname) return;

      e.preventDefault();
      const key = buildKey(chosen, pathname);
      const existing = overridesRef.current[key];
      const cs = window.getComputedStyle(chosen);

      setTarget({
        key,
        text: chosen.textContent ?? "",
        font_family: existing?.font_family ?? cs.fontFamily ?? null,
        font_size: existing?.font_size ?? cs.fontSize ?? null,
        font_weight: existing?.font_weight ?? cs.fontWeight ?? null,
        color: existing?.color ?? cs.color ?? null,
        rect: chosen.getBoundingClientRect(),
        el: chosen,
      });
    }

    function onMouseOver(e: MouseEvent) {
      const node = e.target as HTMLElement;
      if (!node || !node.matches) return;
      if (node.closest(".hr-editor-panel")) return;
      if (node.matches(EDITABLE_SELECTORS) && isLeafText(node)) {
        node.classList.add("hr-edit-hover");
      }
    }
    function onMouseOut(e: MouseEvent) {
      const node = e.target as HTMLElement;
      if (!node || !node.classList) return;
      node.classList.remove("hr-edit-hover");
    }

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.body.classList.add("hr-edit-mode");

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.body.classList.remove("hr-edit-mode");
    };
  }, [isAdmin, editMode, pathname]);

  /* ── API ───────────────────────────────────────────────────────── */
  const refresh = useCallback(async () => {
    const [s, c] = await Promise.all([
      fetch("/api/admin/session").then((r) => r.json()),
      fetch("/api/content").then((r) => r.json()),
    ]);
    setIsAdmin(!!s.isAdmin);
    setDbConfigured(!!s.dbConfigured);
    setOverrides(c.data ?? {});
  }, []);

  const login = useCallback(
    async (password: string) => {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        return { ok: false, error: j.error ?? "Přihlášení selhalo." };
      }
      await refresh();
      return { ok: true };
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAdmin(false);
    setEditMode(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, editMode, setEditMode, refresh, login, logout, dbConfigured }),
    [isAdmin, editMode, refresh, login, logout, dbConfigured],
  );

  /* ── Save handler pro panel ────────────────────────────────────── */
  async function handleSave(payload: Override & { key: string }) {
    if (!target) return;
    // Optimistic update DOM
    applyOverride(target.el, payload);
    setOverrides((o) => ({ ...o, [payload.key]: payload }));
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setTarget(null);
  }

  async function handleReset() {
    if (!target) return;
    await fetch(`/api/content?key=${encodeURIComponent(target.key)}`, {
      method: "DELETE",
    });
    setOverrides((o) => {
      const n = { ...o };
      delete n[target.key];
      return n;
    });
    // Vyžádej refresh stránky pro načtení původního textu
    window.location.reload();
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      {target && (
        <EditorPanel
          target={target}
          onClose={() => setTarget(null)}
          onSave={handleSave}
          onReset={handleReset}
        />
      )}
    </Ctx.Provider>
  );
}
