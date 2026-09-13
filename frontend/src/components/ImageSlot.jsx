// Replaceable image slot. Renders the real image once `src` is provided in
// src/data/images.js — until then it shows a quiet, on-brand placeholder.
export const ImageSlot = ({ name, label, src, alt, ratio = "aspect-[4/5]", className = "", imgClassName = "" }) => {
  if (src) {
    return (
      <div className={`relative ${ratio} overflow-hidden bg-brand-sand/40 ${className}`} data-image-slot={name}>
        <img
          src={src}
          alt={alt || label}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    );
  }
  return (
    <div
      className={`relative ${ratio} overflow-hidden border border-brand-sand bg-brand-surface ${className}`}
      data-image-slot={name}
      role="img"
      aria-label={alt || label}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="font-serif text-5xl leading-none text-brand-orange/60 select-none">H</span>
        <span className="max-w-[16rem] text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-stone">
          {label}
        </span>
      </div>
      <span className="absolute bottom-2 right-3 text-[9px] uppercase tracking-[0.2em] text-brand-stone/50">
        {name}
      </span>
    </div>
  );
};
