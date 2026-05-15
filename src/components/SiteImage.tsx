"use client";

/**
 * SiteImage — univerz\u00e1ln\u00ed obr\u00e1zek pro ve\u0159ejn\u00e9 str\u00e1nky, kter\u00fd lze v admin
 * m\u00f3du editovat pravym klikem (otev\u0159e picker s uploadem na Cloudinary).
 *
 * - V b\u011b\u017en\u00e9m m\u00f3du: render <img src> s p\u0159\u00edpadnym overridem z DB.
 * - V admin edit m\u00f3du: na hover badge "Prav\u00fd klik", na contextmenu picker.
 *
 * Override URL se ukl\u00e1d\u00e1 do tabulky `content_blocks` pod kl\u00ed\u010dem `img::${editKey}`
 * (pole `text` nese URL). Editovan\u00e9 zm\u011bny jdou do drafu (pending) a publikuj\u00ed se
 * tla\u010d\u00edtkem "Publikovat zm\u011bny" v EditorBar.
 */

import { useState } from "react";
import { useEditorOptional } from "./admin/EditorProvider";
import ImagePickerModal from "./admin/ImagePickerModal";
import { MousePointer2 } from "lucide-react";

export default function SiteImage({
  editKey,
  defaultSrc,
  alt = "",
  className = "",
  imgClassName = "w-full h-full object-cover",
}: {
  /** Stabiln\u00ed kl\u00ed\u010d (nap\u0159. "betonove-sterky/gallery-1"). */
  editKey: string;
  /** F\u00e1lloback obr\u00e1zek (Unsplash) kdy\u017e nen\u00ed override. */
  defaultSrc: string;
  alt?: string;
  /** Wrapper \u2014 pou\u017e\u00edt nap\u0159. pro aspect-ratio + overflow-hidden. */
  className?: string;
  /** T\u0159\u00eddy aplikovan\u00e9 na <img>. Default vypln\u00ed cel\u00fd parent. */
  imgClassName?: string;
}) {
  const editor = useEditorOptional();
  const [open, setOpen] = useState(false);

  const overrideUrl = editor?.getImage(editKey) ?? null;
  const src = overrideUrl || defaultSrc;
  const editable = !!editor?.isAdmin && !!editor?.editMode;

  return (
    <>
      <div
        className={`relative ${editable ? "group/site-image" : ""} ${className}`}
        onContextMenu={
          editable
            ? (e) => {
                e.preventDefault();
                setOpen(true);
              }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={imgClassName} />

        {editable && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover/site-image:opacity-100 transition z-10">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/75 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
              <MousePointer2 className="w-3 h-3" />
              Prav\u00fd klik
            </div>
          </div>
        )}
      </div>

      {open && editor && (
        <ImagePickerModal
          currentUrl={src}
          onClose={() => setOpen(false)}
          onPick={(url) => {
            editor.setImage(editKey, url);
            setOpen(false);
          }}
          onReset={
            overrideUrl
              ? async () => {
                  await editor.resetImage(editKey);
                  setOpen(false);
                  window.location.reload();
                }
              : undefined
          }
        />
      )}
    </>
  );
}
