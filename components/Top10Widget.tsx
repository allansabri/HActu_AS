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
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-black tracking-tight">{title}</div>
        <Link href="/top-10-france" className="text-[10px] font-bold text-max-cyan hover:text-white">Voir tout</Link>
      </div>
      <div className="space-y-px">
        {rows.length ? (
          rows.map((item) => (
            <Link
              key={item.id}
              href={titleHref(item.type, item.title)}
              className="grid grid-cols-[26px_26px_1fr] items-center gap-2 rounded-md px-1 py-[5px] text-[13px] hover:bg-white/5"
            >
              <span className="font-black text-[17px] leading-none text-white/40 tabular-nums">{item.rank}</span>
              {item.image_url ? (
                <img src={item.image_url} alt="" className="h-7 w-5 rounded object-cover" />
              ) : (
                <div className="h-7 w-5 rounded bg-white/10" />
              )}
              <span className="min-w-0 truncate font-medium leading-tight text-white/90">{item.title}</span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-white/55">Aucun.</p>
        )}
      </div>
    </div>
  );
}

export function Top10Widget({ items }: { items: Top10Item[] }) {
  return (
    <div>
      {items.length ? (
        <div className="space-y-5">
          <TopMiniList title="Top Séries" type="series" items={items} />
          <div className="h-px bg-white/10" />
          <TopMiniList title="Top Films" type="movie" items={items} />
        </div>
      ) : (
        <p className="text-sm leading-6 text-white/60">Aucun classement saisi pour aujourd’hui.</p>
      )}
    </div>
  );
}
