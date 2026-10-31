export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 text-[clamp(2.25rem,6vw,5rem)] font-semibold tracking-[-0.04em] text-ink sm:px-10">{t}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0 text-brand sm:size-8" fill="currentColor">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee relative overflow-hidden bg-white py-10 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] sm:py-14">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
