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
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-max-cyan">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h2>
      {text ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{text}</p> : null}
    </div>
  );
}
