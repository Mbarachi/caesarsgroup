import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type ProductShowcaseProps = {
  title: string;
  subtitle?: string;
  images: string[]; // pass 3–6 images per product
  features?: string[];
  price?: string;
  onEnquire?: () => void;
};

export default function ProductShowcase({ title, subtitle, images, features = [], price, onEnquire }: ProductShowcaseProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1 || lightboxOpen) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length, lightboxOpen]);

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + images.length) % images.length);
  const goLightbox = (dir: -1 | 1) => setLightboxIndex((i) => (i + dir + images.length) % images.length);

  // lock body scroll when lightbox open and add keyboard controls
  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goLightbox(1);
      if (e.key === "ArrowLeft") goLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  return (
    <div className="rounded-3xl overflow-hidden border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div
        className="relative aspect-[16/10] bg-black/2 cursor-zoom-in"
        onClick={() => { setLightboxOpen(true); setLightboxIndex(index); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightboxOpen(true); setLightboxIndex(index); } }}
        aria-label={`Open ${title} images`}
      >
        {/* slides */}
        {images.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={`${title} view ${i + 1}`}
            className="absolute inset-0 h-full w-full object-contain object-center"
            initial={{ opacity: 0, scale: 1.005 }}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.005 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}

        {/* gradient masks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />

        {/* controls */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-3">
            <Button
              variant="outline"
              className="bg-white/70 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Previous image"
            >
              ‹
            </Button>
            <Button
              variant="outline"
              className="bg-white/70 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Next image"
            >
              ›
            </Button>
          </div>
        )}

        {/* dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to image ${i + 1}`}
              />)
            )}
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-lg font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>}
          </div>
          {/* {price && <div className="text-right"><p className="text-sm text-gray-500">From</p><p className="text-lg font-semibold">{price}</p></div>} */}
        </div>

        {features.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onEnquire}>Enquire</Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} images viewer`}
          onClick={() => setLightboxOpen(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            {/* current image */}
            {images.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt={`${title} enlarged view ${i + 1}`}
                className="absolute max-h-[85vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: i === lightboxIndex ? 1 : 0, scale: i === lightboxIndex ? 1 : 0.99 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            ))}

            {/* prev/next */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button variant="outline" className="bg-white/80" onClick={() => goLightbox(-1)} aria-label="Previous">‹</Button>
                <Button variant="outline" className="bg-white/80" onClick={() => goLightbox(1)} aria-label="Next">›</Button>
              </div>
            )}

            {/* close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 text-gray-900 font-bold shadow-md"
              aria-label="Close viewer"
            >
              ×
            </button>

            {/* dots */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full ${i === lightboxIndex ? "bg-white" : "bg-white/50"}`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/90 text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
