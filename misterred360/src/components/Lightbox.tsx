import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/* ───────────────────────────────────────────────────────────
   Lightbox global · pop-up con la foto entera al hacer clic
   sobre cualquier imagen marcada con data-cursor="view"
   ─────────────────────────────────────────────────────────── */

type LightboxImage = { src: string; alt: string };

const LightboxContext = createContext<(image: LightboxImage) => void>(() => {});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const close = useCallback(() => setImage(null), []);

  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [image, close]);

  return (
    <LightboxContext.Provider value={setImage}>
      {children}
      <AnimatePresence>
        {image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/95 backdrop-blur-sm px-5 py-10 md:px-10"
            role="dialog"
            aria-modal="true"
            aria-label={image.alt}
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-5 right-5 md:top-8 md:right-8 inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-paper transition-colors hover:border-brand hover:text-brand"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              key={image.src}
              src={image.src}
              alt={image.alt}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
