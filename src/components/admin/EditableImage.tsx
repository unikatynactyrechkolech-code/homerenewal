"use client";

/**
 * EditableImage — wrapper okolo <img> v admin form\u00e1\u0159i (PropertyEditor).
 * Na hover ukazuje hint "Prav\u00fd klik", na pravy klik otev\u0159e ImagePickerModal.
 */

import { useState } from "react";
import { MousePointer2 } from "lucide-react";
import ImagePickerModal from "./ImagePickerModal";

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
