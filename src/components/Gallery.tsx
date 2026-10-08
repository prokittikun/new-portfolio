"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useLenis } from "./fx/SmoothScroll";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const lenis = useLenis();

  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, lenis, step]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((src, i) => (
          <motion.button
            key={src}
            onClick={() => setIndex(i)}
            data-cursor="link"
            data-cursor-label="Zoom"
            className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-line bg-ink-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              width={1200}
              height={800}
              unoptimized={src.endsWith(".gif")}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
            />
            <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-fg/70 backdrop-blur">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-xl sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndex(null)}
            role="dialog"
            aria-label="Image viewer"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={images[index]}
                  alt={`${title} screenshot ${index + 1}`}
                  fill
                  unoptimized={images[index].endsWith(".gif")}
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 font-mono text-xs">
              <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="glass rounded-full px-4 py-2 hover:text-accent" aria-label="Previous image">
                ←
              </button>
              <span className="text-muted">
                {index + 1} / {images.length}
              </span>
              <button onClick={(e) => { e.stopPropagation(); step(1); }} className="glass rounded-full px-4 py-2 hover:text-accent" aria-label="Next image">
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
