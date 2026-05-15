"use client";

/**
 * EditableImage — wrapper okolo <img> v admin sekci.
 * Na hover ukazuje hint "klikni pravým", na pravý klik otevře picker
 * (upload nový + URL ručně). Po výběru zavolá onChange s novou URL.
 *
 * Pou\u017e\u00edv\u00e1 se v PropertyEditoru pro cover_image a galerii.
 */

import { useState, useRef, useEffect } from "react";
import { MousePointer2, X, Link as LinkIcon } from "lucide-react";
import ImageUploader from "./ImageUploader";

export default function EditableImage({
  src,
  alt = "",
  className = "",
  onChange,
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  onChange: (url: string) => void;
  /** Volitelný overlay (např. mazací tlačítka) — zobrazí se nad hint. */
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`relative group/img ${className}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover block" />

        {/* Hint: jen v admin (komponenta se pou\u017e\u00edv\u00e1 jen tam) */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover/img:opacity-100 transition">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/75 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            <MousePointer2 className="w-3 h-3" />
            Pravý klik
          </div>
        </div>

        {children}
      </div>

      {open && (
        <ImagePickerModal
          currentUrl={src}
          onClose={() => setOpen(false)}
          onPick={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function ImagePickerModal({
  currentUrl,
  onClose,
  onPick,
}: {
  currentUrl: string;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Změna obrázku
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition"
            aria-label="Zavřít"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* N\u00e1hled aktu\u00e1ln\u00edho */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
              Aktuální
            </div>
            <div className="aspect-[16/10] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentUrl} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Upload nov\u00e9ho */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
              Nahrát nový
            </div>
            <ImageUploader
              multiple={false}
              onUploaded={(urls) => urls[0] && onPick(urls[0])}
            />
          </div>

          {/* URL ru\u010dn\u011b */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
              Nebo URL
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 focus:outline-none focus:border-[#c8a97e]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && url.trim()) {
                      e.preventDefault();
                      onPick(url.trim());
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => url.trim() && onPick(url.trim())}
                disabled={!url.trim()}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a97e] hover:bg-[#b89569] text-white rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Použít
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
