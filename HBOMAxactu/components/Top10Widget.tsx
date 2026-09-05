import Link from "next/link";
import { titleHref } from "@/lib/links";
import { ContentType, Top10Item } from "@/lib/types";

function TopMiniList({
  title,
  type,
  items
}: {
  title: string;
  type: ContentType;
  items: Top10Item[];
}) {
  const rows = items
    .filter((item) => item.type === type)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);

  return (
    <section className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-sm font-black">{title}</h3>
        <Link href="/top-10-france" className="text-[11px] font-bold text-max-cyan hover:text-white">
          Voir plus
        </Link>
      </div>
      <div className="space-y-1.5">
        {rows.length ? (
          rows.map((item) => (
            <Link
              key={item.id}
              href={titleHref(item.type, item.title)}
              className="grid grid-cols-[24px_30px_1fr] items-center gap-2 rounded-[6px] p-1.5 hover:bg-white/6"
            >
              <span className="text-lg font-black text-white/35">{item.rank}</span>
              {item.image_url ? (
                <img src={item.image_url} alt="" className="h-10 w-7 rounded object-cover" />
              ) : (
                <div className="h-10 w-7 rounded bg-white/10" />
              )}
              <p className="min-w-0 truncate text-xs font-bold leading-tight">{item.title}</p>
            </Link>
          ))
        ) : (
          <p className="text-sm leading-6 text-white/55">Aucun classement.</p>
        )}
      </div>
    </section>
  );
}

export function Top10Widget({ items }: { items: Top10Item[] }) {
  return (
    <aside className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">Top 10 France</h2>
        <Link href="/top-10-france" className="text-xs font-bold text-max-cyan hover:text-white">
          Voir tout
        </Link>
      </div>
      {items.length ? (
        <div className="space-y-4">
          <TopMiniList title="Top series" type="series" items={items} />
          <TopMiniList title="Top films" type="movie" items={items} />
        </div>
      ) : (
        <p className="text-sm leading-6 text-white/60">
          Aucun classement saisi pour aujourd'hui. Utilise le module Top 10 dans l'admin.
        </p>
      )}
    </aside>
  );
}
