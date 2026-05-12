"use client";

import { useState } from "react";
import { useEditor } from "./EditorProvider";
import {
  LogOut,
  Lock,
  X,
  Database,
  ExternalLink,
  Rocket,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function AdminBar() {
  const {
    isAdmin,
    login,
    logout,
    dbConfigured,
    pendingCount,
    publishing,
    publish,
    discard,
  } = useEditor();
  const locale = useLocale();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const r = await login(password);
    setLoading(false);
    if (r.ok) {
      setShowLogin(false);
      setPassword("");
    } else {
      setError(r.error ?? "Chyba");
    }
  }

  async function handlePublish() {
    const r = await publish();
    if (r.ok) {
      setToast("✓ Změny publikovány");
      setTimeout(() => setToast(null), 2500);
    } else {
      setToast(r.error ?? "Publikace selhala");
      setTimeout(() => setToast(null), 4000);
    }
  }

  return (
    <>
      {/* TOP BAR — viditelný jen pro adminy */}
      {isAdmin && (
        <>
          <div className="hr-editor-panel fixed top-0 inset-x-0 z-[9990] bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/10 text-white">
            <div className="max-w-[1600px] mx-auto h-12 px-4 sm:px-6 flex items-center justify-between gap-3">
              {/* LEFT — status */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex items-center gap-2 shrink-0">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-sm font-semibold tracking-wide">
                    Web editace
                  </span>
                </span>
                <span className="hidden md:inline text-xs text-white/40">
                  Pravým klikem na text otevřeš editor.
                </span>
              </div>

              {/* RIGHT — actions */}
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/${locale}/admin`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-transparent border border-white/20 text-white/80 hover:bg-white/10 transition"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Správa inzerátů</span>
                </Link>

                {pendingCount > 0 && (
                  <button
                    type="button"
                    onClick={discard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-transparent border border-white/15 text-white/60 hover:text-white hover:bg-white/10 transition"
                    title="Zahodit nepublikované změny"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Zahodit</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={pendingCount === 0 || publishing}
                  className={`relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
                    pendingCount > 0
                      ? "bg-[#c8a97e] hover:bg-[#b89569] border-[#c8a97e] text-white shadow-lg shadow-[#c8a97e]/20"
                      : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                  title={
                    pendingCount === 0
                      ? "Žádné nepublikované změny"
                      : `Publikovat ${pendingCount} změn`
                  }
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>{publishing ? "Publikuji…" : "Publikovat změny"}</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-[#1a1a1a] text-[10px] font-bold">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-transparent border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition"
                  title="Odhlásit"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Odhlásit se</span>
                </button>
              </div>
            </div>
          </div>
          {/* spacer aby fixed top bar nezakryl obsah */}
          <div aria-hidden className="h-12" />

          {/* TOAST */}
          {toast && (
            <div className="hr-editor-panel fixed top-16 right-6 z-[9995] bg-[#1a1a1a] text-white text-sm px-4 py-2.5 rounded-lg shadow-2xl border border-white/10">
              {toast}
            </div>
          )}
        </>
      )}

      {/* LOCK ICON — viditelný jen pro nepřihlášené */}
      {!isAdmin && !showLogin && (
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className="hr-editor-panel fixed bottom-6 right-6 z-[9990] bg-[#1a1a1a]/90 hover:bg-[#1a1a1a] backdrop-blur text-white/80 hover:text-white p-3 rounded-full shadow-2xl border border-white/10 transition opacity-30 hover:opacity-100"
          title="Admin"
        >
          <Lock className="w-4 h-4" />
        </button>
      )}

      {/* Login modal */}
      {showLogin && !isAdmin && (
        <div
          className="hr-editor-panel fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowLogin(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleLogin}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#c8a97e]" />
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  Přihlášení do administrace
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="p-1 rounded hover:bg-black/5"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!dbConfigured && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                  <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    Databáze není připojená. Po přihlášení budou texty
                    editovatelné pouze lokálně do načtení stránky. Nastav{" "}
                    <code>SUPABASE_SERVICE_ROLE_KEY</code> v{" "}
                    <code>.env.local</code>.
                  </div>
                </div>
              )}
              <label className="block">
                <span className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Heslo
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#c8a97e] focus:ring-2 focus:ring-[#c8a97e]/20"
                  placeholder="••••••••"
                />
              </label>
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-black/5 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                Zrušit
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a97e] hover:bg-[#b89569] disabled:opacity-50 text-white rounded transition"
              >
                {loading ? "Přihlašuji…" : "Přihlásit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
