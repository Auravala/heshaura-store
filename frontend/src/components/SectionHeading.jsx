export const Overline = ({ children, className = "" }) => (
  <p className={`text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange ${className}`}>
    {children}
  </p>
);

export const SectionHeading = ({ overline, title, text, align = "left" }) => (
  <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {overline && <Overline className={align === "center" ? "justify-center" : ""}>{overline}</Overline>}
    <h2 className="mt-4 font-serif text-3xl tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl text-balance">
      {title}
    </h2>
    {text && <p className="mt-5 text-base leading-relaxed text-brand-stone">{text}</p>}
  </div>
);
