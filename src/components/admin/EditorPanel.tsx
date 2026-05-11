"use client";

import { useEffect, useState } from "react";
import { X, Save, RotateCcw, Type } from "lucide-react";

type Target = {
  key: string;
  text: string;
  font_family: string | null;
  font_size: string | null;
  font_weight: string | null;
  color: string | null;
  rect: DOMRect;
  el: HTMLElement;
};

type Payload = {
  key: string;
  text: string;
  font_family: string | null;
  font_size: string | null;
  font_weight: string | null;
  color: string | null;
};

const FONT_FAMILIES = [
  { label: "Inter (výchozí)", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Playfair Display (serif)", value: "'Playfair Display', Georgia, serif" },
  { label: "Georgia (serif)", value: "Georgia, 'Times New Roman', serif" },
  { label: "Courier (mono)", value: "'Courier New', ui-monospace, monospace" },
  { label: "System sans-serif", value: "ui-sans-serif, system-ui, sans-serif" },
];

function parsePx(v: string | null, fallback = 16): number {
  if (!v) return fallback;
  const m = v.match(/([\d.]+)px/);
  return m ? Math.round(parseFloat(m[1])) : fallback;
}

export default function EditorPanel({
  target,
  onClose,
  onSave,
  onReset,
}: {
  target: Target;
  onClose: () => void;
  onSave: (p: Payload) => void | Promise<void>;
  onReset: () => void | Promise<void>;
}) {
  const [text, setText] = useState(target.text);
  const [fontFamily, setFontFamily] = useState(target.font_family ?? "");
  const [fontSize, setFontSize] = useState(parsePx(target.font_size, 16));
  const [fontWeight, setFontWeight] = useState(
    Number(target.font_weight ?? 400),
  );
  const [color, setColor] = useState(rgbToHex(target.color) ?? "#1a1a1a");

  useEffect(() => {
    setText(target.text);
    setFontFamily(target.font_family ?? "");
    setFontSize(parsePx(target.font_size, 16));
    setFontWeight(Number(target.font_weight ?? 400));
    setColor(rgbToHex(target.color) ?? "#1a1a1a");
  }, [target]);

  // Pozice panelu: snaž se panel umístit blízko cíle, ale udrž ho ve viewportu.
  const PANEL_W = 380;
  const PANEL_H = 520;
  let left = target.rect.left + window.scrollX;
  let top = target.rect.bottom + window.scrollY + 8;

  if (left + PANEL_W > window.innerWidth - 16) {
    left = Math.max(16, window.innerWidth - PANEL_W - 16);
  }
  if (top + PANEL_H > window.innerHeight + window.scrollY - 16) {
    top = Math.max(16, target.rect.top + window.scrollY - PANEL_H - 8);
  }

  function submit() {
    onSave({
      key: target.key,
      text,
      font_family: fontFamily || null,
      font_size: `${fontSize}px`,
      font_weight: String(fontWeight),
      color,
    });
  }

  return (
    <>
      {/* Pozadí pro zachycení Esc */}
      <div
        className="hr-editor-panel fixed inset-0 z-[9998]"
        onClick={onClose}
        onContextMenu={(e) => e.preventDefault()}
        style={{ pointerEvents: "auto", background: "transparent" }}
      />

      <div
        className="hr-editor-panel fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden"
        style={{ left, top, width: PANEL_W }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-black/5 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#c8a97e]" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Úprava textu
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition"
            aria-label="Zavřít"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[440px] overflow-y-auto">
          {/* Klíč */}
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-mono break-all">
            {target.key}
          </div>

          {/* Text */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={Math.max(2, Math.min(10, Math.ceil(text.length / 50)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#c8a97e] focus:ring-2 focus:ring-[#c8a97e]/20 resize-y"
              autoFocus
            />
          </div>

          {/* Font family */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Písmo
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#c8a97e] bg-white"
            >
              <option value="">— ponechat výchozí —</option>
              {FONT_FAMILIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Velikost */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Velikost: {fontSize}px
            </label>
            <input
              type="range"
              min={10}
              max={96}
              step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#c8a97e]"
            />
          </div>

          {/* Tučnost */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Tučnost: {fontWeight}
            </label>
            <div className="grid grid-cols-7 gap-1">
              {[300, 400, 500, 600, 700, 800, 900].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setFontWeight(w)}
                  className={`py-1.5 text-xs rounded transition ${
                    fontWeight === w
                      ? "bg-[#c8a97e] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Barva */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Barva
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 focus:outline-none focus:border-[#c8a97e]"
              />
              <div className="flex gap-1">
                {["#1a1a1a", "#c8a97e", "#ffffff", "#6b7280", "#dc2626"].map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded border border-gray-300"
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-black/5 bg-gray-50">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Obnovit původní
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition"
            >
              Zrušit
            </button>
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a97e] hover:bg-[#b89569] text-white rounded transition"
            >
              <Save className="w-3.5 h-3.5" />
              Uložit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function rgbToHex(input: string | null): string | null {
  if (!input) return null;
  if (input.startsWith("#")) return input;
  const m = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  const toHex = (n: string) => Number(n).toString(16).padStart(2, "0");
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}
