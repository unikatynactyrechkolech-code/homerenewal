"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
  pendingCount: number;
  publishing: boolean;
  publish: () => Promise<{ ok: boolean; error?: string }>;
  discard: () => void;
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
  // Přeskočit prvky označené jako no-override nebo uvnitř headeru
  if (el.hasAttribute("data-no-override")) return false;
  if (el.closest("header")) return false;

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
  // Inline styly (barva, font) záměrně NEAPLIKUJEME — design řídí výhradně CSS/Tailwind.
  // Aplikace inline stylů by přebila CSS třídy závislé na stavu komponenty (např. bílý vs. průhledný header).
}

export default function EditorProvider({
  children,
  initialContent = {},
}: {
  children: React.ReactNode;
  initialContent?: Record<string, Override>;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbConfigured, setDbConfigured] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Override>>(initialContent);

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

  // Draft — změny aplikované lokálně, ještě nepubliko­vané do DB.
  const [pending, setPending] = useState<Record<string, Override>>({});
  const [publishing, setPublishing] = useState(false);

  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  /* ── Načti session při startu ────────────── */
  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const adm = !!d.isAdmin;
        setIsAdmin(adm);
        setDbConfigured(!!d.dbConfigured);
        // Editace VRŽDY zapnutá když jsi admin.
        if (adm) setEditMode(true);
      })
      .catch(() => {});
  }, []);

  /* ── Aplikuj overrides + pending na DOM synchronně před paintem ──── */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname) return;
    const els = document.querySelectorAll<HTMLElement>(EDITABLE_SELECTORS);
    els.forEach((el) => {
      if (!isLeafText(el)) return;
      const key = buildKey(el, pathname);
      const o = pending[key] ?? overrides[key];
      if (o) applyOverride(el, o);
    });
  }, [pathname, overrides, pending]);

  /* ── Right-click handler v editMode ───────────────────────── */
  useEffect(() => {
    if (!isAdmin || !editMode) return;
    // Na /admin route nechceme edit mode — má vlastní UI
    if (pathname && /\/admin(\/|$)/.test(pathname)) return;

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
      const existing = pendingRef.current[key] ?? overridesRef.current[key];
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
      fetch("/api/admin/session", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/content", { cache: "no-store" }).then((r) => r.json()),
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
      setEditMode(true);
      return { ok: true };
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAdmin(false);
    setEditMode(false);
  }, []);

  /* ── Publish / discard ─────────────────────────────────────────── */
  const publish = useCallback(async () => {
    const entries = Object.entries(pending);
    if (entries.length === 0) return { ok: true };
    setPublishing(true);
    try {
      const r = await fetch("/api/content/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: entries.map(([key, v]) => ({ key, ...v })) }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        return { ok: false, error: j.error ?? "Publikace selhala." };
      }
      // přesuň pending → overrides
      setOverrides((o) => ({ ...o, ...pending }));
      setPending({});
      return { ok: true };
    } finally {
      setPublishing(false);
    }
  }, [pending]);

  const discard = useCallback(() => {
    if (Object.keys(pending).length === 0) return;
    if (!window.confirm("Zahodit všechny nepublikované změny?")) return;
    setPending({});
    window.location.reload();
  }, [pending]);

  const value = useMemo(
    () => ({
      isAdmin,
      editMode,
      setEditMode,
      refresh,
      login,
      logout,
      dbConfigured,
      pendingCount: Object.keys(pending).length,
      publishing,
      publish,
      discard,
    }),
    [isAdmin, editMode, refresh, login, logout, dbConfigured, pending, publishing, publish, discard],
  );

  /* ── Save handler pro panel: aplikuj jen lokálně (draft) ──────── */
  function handleSave(payload: Override & { key: string }) {
    if (!target) return;
    applyOverride(target.el, payload);
    setPending((p) => ({ ...p, [payload.key]: payload }));
    setTarget(null);
  }

  async function handleReset() {
    if (!target) return;
    // Pokud je změna jen v draftu, stačí ji odebrat lokálně.
    if (pending[target.key] && !overridesRef.current[target.key]) {
      setPending((p) => {
        const n = { ...p };
        delete n[target.key];
        return n;
      });
      setTarget(null);
      window.location.reload();
      return;
    }
    // Jinak smazat z DB.
    await fetch(`/api/content?key=${encodeURIComponent(target.key)}`, {
      method: "DELETE",
    });
    setOverrides((o) => {
      const n = { ...o };
      delete n[target.key];
      return n;
    });
    setPending((p) => {
      const n = { ...p };
      delete n[target.key];
      return n;
    });
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
