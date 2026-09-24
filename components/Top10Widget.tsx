import Link from "next/link";
import { titleHref } from "@/lib/links";
import { ContentType, Top10Item } from "@/lib/types";

function TopMiniList({
  title,
  type,
  items,
  variant = "default"
}: {
  title: string;
  type: ContentType;
  items: Top10Item[];
  variant?: "default" | "prominent";
}) {
  const rows = items
    .filter((item) => item.type === type)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);

  const isProminent = variant === "prominent";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className={isProminent ? "text-base font-black tracking-tight text-white" : "text-sm font-black tracking-tight"}>
          {title}
        </div>
        <Link href="/top-10-france" className="text-[11px] font-bold text-max-cyan hover:text-white transition-colors">
          Voir tout →
        </Link>
      </div>

      <div className={isProminent ? "space-y-3 sm:space-y-3.5" : "space-y-px"}>
        {rows.length ? (
          rows.map((item) => {
            if (isProminent) {
              return (
                <Link
                  key={item.id}
                  href={titleHref(item.type, item.title)}
                  className="group flex items-center rounded-xl p-1.5 transition-all duration-200 hover:bg-white/[0.06]"
                >
                  {/* Chiffre collé et placé légèrement derrière la carte mais bien visible */}
                  <div className="relative flex items-center shrink-0">
                    <span className="relative z-0 font-black text-3xl sm:text-4xl text-white/45 select-none tracking-tighter leading-none -mr-3 sm:-mr-3.5 w-8 sm:w-9 text-right drop-shadow-sm group-hover:text-max-cyan/85 transition-colors">
                      {item.rank}
                    </span>
                    <div className="relative z-10 w-[54px] h-[78px] sm:w-[60px] sm:h-[86px] rounded-md overflow-hidden shadow-lg border border-white/15 bg-neutral-900 shrink-0 transition-transform duration-200 group-hover:scale-[1.03]">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-white/10" />
                      )}
                    </div>
                  </div>

                  {/* Titre et détails à droite */}
                  <div className="flex flex-col justify-center min-w-0 flex-1 ml-3.5">
                    <span className="font-bold text-sm sm:text-[15px] text-white leading-snug line-clamp-2 group-hover:text-max-cyan transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-medium text-white/50 mt-1 uppercase tracking-wider">
                      {type === "series" ? "Série" : "Film"}
                    </span>
                  </div>
                </Link>
              );
            }

            return (
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
            );
          })
        ) : (
          <p className="text-sm text-white/55">Aucun.</p>
        )}
      </div>
    </div>
  );
}

export function Top10Widget({
  items,
  variant = "default"
}: {
  items: Top10Item[];
  variant?: "default" | "prominent";
}) {
  const isProminent = variant === "prominent";

  return (
    <div>
      {items.length ? (
        <div className={isProminent ? "space-y-6 sm:space-y-7" : "space-y-5"}>
          <TopMiniList title="Top Séries" type="series" items={items} variant={variant} />
          <div className="h-px bg-white/10" />
          <TopMiniList title="Top Films" type="movie" items={items} variant={variant} />
        </div>
      ) : (
        <p className="text-sm leading-6 text-white/60">Aucun classement saisi pour aujourd’hui.</p>
      )}
    </div>
  );
}
