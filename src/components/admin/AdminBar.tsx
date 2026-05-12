"use client";

import { useState } from "react";
import { useEditor } from "./EditorProvider";
import { Edit3, LogOut, Lock, X, Database, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function AdminBar() {
  const { isAdmin, editMode, setEditMode, login, logout, dbConfigured } =
    useEditor();
  const locale = useLocale();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const r = await login(password);
    setLoading(false);
    if (r.ok) {
      setShowLogin(false);
      setPassword("");
      setEditMode(true);
    } else {
      setError(r.error ?? "Chyba");
    }
  }

  return (
    <>
      {/* Floating bar */}
      <div className="fixed bottom-6 right-6 z-[9990] flex items-center gap-2">
        {!isAdmin && !showLogin && (
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="hr-editor-panel bg-[#1a1a1a]/90 hover:bg-[#1a1a1a] backdrop-blur text-white/80 hover:text-white p-3 rounded-full shadow-2xl border border-white/10 transition opacity-30 hover:opacity-100"
            title="Admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}

        {isAdmin && (
          <div className="hr-editor-panel flex items-center gap-1 bg-[#1a1a1a] text-white rounded-full shadow-2xl border border-white/10 p-1.5 pl-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c8a97e] mr-2">
              Admin
            </span>
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                editMode
                  ? "bg-[#c8a97e] text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editMode ? "Editace ZAP" : "Editovat"}
            </button>
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition"
            >
              <Database className="w-3.5 h-3.5" />
              Inzeráty
            </Link>
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-full hover:bg-white/10 transition"
              title="Odhlásit"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

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
                    Databáze není připojená. Po přihlášení budou texty editovatelné
                    pouze lokálně do načtení stránky. Nastav <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
                    v <code>.env.local</code>.
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
