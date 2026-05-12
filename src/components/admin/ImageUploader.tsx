"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";

type UploadResult = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
};

export default function ImageUploader({
  onUploaded,
  multiple = true,
  className = "",
}: {
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setError(null);
      setBusy(true);
      setProgress({ done: 0, total: files.length });

      try {
        // 1) Získej podpis z backendu (jeden pro všechny soubory v této dávce).
        const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
        if (!signRes.ok) {
          const j = await signRes.json().catch(() => ({}));
          throw new Error(j.error ?? "Sign endpoint selhal");
        }
        const sign = (await signRes.json()) as {
          cloudName: string;
          apiKey: string;
          timestamp: number;
          folder: string;
          signature: string;
        };

        const uploaded: string[] = [];

        // 2) Postupně upload každý soubor (Cloudinary akceptuje paralelně, ale UX je jednodušší).
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fd = new FormData();
          fd.append("file", file);
          fd.append("api_key", sign.apiKey);
          fd.append("timestamp", String(sign.timestamp));
          fd.append("signature", sign.signature);
          fd.append("folder", sign.folder);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
            { method: "POST", body: fd },
          );
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error?.message ?? `Upload selhal (${res.status})`);
          }
          const data = (await res.json()) as UploadResult;
          uploaded.push(data.secure_url);
          setProgress({ done: i + 1, total: files.length });
        }

        onUploaded(uploaded);
      } catch (e: unknown) {
        setError((e as Error).message ?? "Neznámá chyba");
      } finally {
        setBusy(false);
        setProgress(null);
      }
    },
    [onUploaded],
  );

  function pickFiles() {
    inputRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length) upload(files);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length) upload(files);
  }

  return (
    <div className={className}>
      <div
        onClick={pickFiles}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition ${
          dragOver
            ? "border-[#c8a97e] bg-[#c8a97e]/5"
            : "border-gray-300 hover:border-[#c8a97e] hover:bg-gray-50"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={onChange}
        />
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin text-[#c8a97e]" />
            <div className="text-sm font-semibold">
              Nahrávám {progress?.done ?? 0} / {progress?.total ?? 0}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#c8a97e]/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#c8a97e]" />
            </div>
            <div className="text-sm font-semibold text-primary">
              Klikni nebo přetáhni obrázky
            </div>
            <div className="text-xs text-muted">
              JPG, PNG, WebP · {multiple ? "více souborů najednou" : "jeden soubor"}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
