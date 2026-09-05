export function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-4">
      {eyebrow ? (
        <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-max-cyan">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-black tracking-[-0.015em] md:text-[27px]">{title}</h2>
      {text ? <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-white/60">{text}</p> : null}
    </div>
  );
}
