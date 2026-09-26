import Link from "next/link";
import { titleHref } from "@/lib/links";
import { ContentType, Top10Item } from "@/lib/types";
import { Top10Config } from "@/lib/top10-config";
import { ChevronRight } from "lucide-react";

interface HomeTop10SectionProps {
  items: Top10Item[];
  config?: Top10Config | null;
}

interface Top10ColumnProps {
  subtitle: string;
  type: ContentType;
  items: Top10Item[];
}

function ItemRankStats({ item, isTop1 }: { item: Top10Item; isTop1?: boolean }) {
  const days = item.days_in_top ?? 1;
  const diff = item.rank_diff;
  const isNew = item.is_new;

  // Mention demandée : si descend en top 2, mettre -1 en rouge avec la mention "7j dans le top 1"
  let daysText = `${days}J dans le top`;
  if (item.rank > 1 && item.days_in_top_1 && item.days_in_top_1 > 0) {
    daysText = `${item.days_in_top_1}j dans le top 1`;
  }

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${isTop1 ? "mt-1.5 text-xs" : "mt-0.5 text-[11px] sm:text-xs"}`}>
      {/* Indicateur de position : Nouveau, -1 (rouge), +1 (vert), = (neutre) */}
      {isNew ? (
        <span className="font-extrabold text-max-cyan text-[10px] uppercase tracking-wide bg-max-cyan/15 px-1 py-0.2 rounded">
          Nouveau
        </span>
      ) : diff !== undefined && diff !== null ? (
        diff < 0 ? (
          <span className="font-extrabold text-red-400 flex items-center gap-0.5">
            <span className="text-[9px]">▼</span> {diff}
          </span>
        ) : diff > 0 ? (
          <span className="font-extrabold text-emerald-400 flex items-center gap-0.5">
            <span className="text-[9px]">▲</span> +{diff}
          </span>
        ) : (
          <span className="font-bold text-white/40" title="Position stable">
            =
          </span>
        )
      ) : null}

      {/* Texte en vert (ex: 7J dans le top, ou 7j dans le top 1) */}
      <span className="font-semibold text-emerald-400">
        {daysText}
      </span>
    </div>
  );
}

function Top10Column({ subtitle, type, items }: Top10ColumnProps) {
  // Récupération des 5 premiers éléments (Top 1 mis en avant + Top 2 à 5)
  const rows = items
    .filter((item) => item.type === type)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);

  const top1 = rows[0];
  const others = rows.slice(1, 5);

  return (
    <div className="flex flex-col">
      {/* Sous-titre hors du rectangle, proche et calé à gauche, en casse normale */}
      {subtitle ? (
        <div className="mb-2 flex items-center">
          <h3 className="text-xs sm:text-sm font-semibold text-white/85">
            {subtitle}
          </h3>
        </div>
      ) : null}

      {/* Rectangle sans aucun arrondi, avec dégradé gris foncé clair élégant */}
      <div className="flex flex-col rounded-none border border-white/15 bg-gradient-to-b from-[#2a323d] via-[#1d232b] to-[#12161d] shadow-[0_10px_25px_rgba(0,0,0,0.55)] backdrop-blur-md overflow-hidden">
        {/* TOP 1 : Mis en avant avec taille modérée et équilibrée */}
        {top1 && (
          <Link
            href={titleHref(top1.type, top1.title)}
            className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 md:p-4 bg-white/[0.04] border-b border-white/15 transition-all duration-200 hover:bg-white/[0.08]"
          >
            {/* Chiffre #1 */}
            <div className="w-9 sm:w-10 text-center shrink-0">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white/40 group-hover:text-[#a5abb2] transition-colors duration-200 tabular-nums">
                #{top1.rank}
              </span>
            </div>

            {/* Affiche Top 1 (format modéré, ni trop grand ni trop petit) */}
            <div className="relative w-14 h-20 sm:w-16 sm:h-24 md:w-[68px] md:h-[96px] shrink-0 overflow-hidden rounded-none border border-white/20 bg-neutral-900 shadow-md transition-transform duration-200 group-hover:scale-[1.02]">
              {top1.image_url ? (
                <img
                  src={top1.image_url}
                  alt={top1.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-[10px] text-white/40">
                  Max
                </div>
              )}
            </div>

            {/* Titre et indicateurs (vert 7J dans le top, etc.) */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base md:text-lg font-bold leading-snug text-white group-hover:text-[#a5abb2] transition-colors duration-200 line-clamp-2">
                {top1.title}
              </h4>
              <ItemRankStats item={top1} isTop1={true} />
            </div>
          </Link>
        )}

        {/* TOP 2 à 5 : Format compact et harmonieux */}
        {others.length > 0 ? (
          <div className="divide-y divide-white/10">
            {others.map((item) => (
              <Link
                key={item.id}
                href={titleHref(item.type, item.title)}
                className="group flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all duration-200 hover:bg-white/[0.04]"
              >
                {/* Chiffre */}
                <div className="w-7 sm:w-8 text-center shrink-0">
                  <span className="text-base sm:text-lg md:text-xl font-black text-white/30 group-hover:text-[#a5abb2] transition-colors duration-200 tabular-nums">
                    #{item.rank}
                  </span>
                </div>

                {/* Affiche compacte */}
                <div className="relative w-9 h-13 sm:w-10 sm:h-14 md:w-11 md:h-16 shrink-0 overflow-hidden rounded-none border border-white/10 bg-neutral-900 shadow-sm transition-transform duration-200 group-hover:scale-[1.03]">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/10 text-[8px] text-white/40">
                      Max
                    </div>
                  )}
                </div>

                {/* Titre et indicateurs (rouge -1, vert +1, vert 7J dans le top) */}
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs sm:text-[13px] md:text-sm font-semibold leading-tight text-white group-hover:text-[#a5abb2] transition-colors duration-200 line-clamp-2">
                    {item.title}
                  </h5>
                  <ItemRankStats item={item} isTop1={false} />
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {rows.length === 0 && (
          <div className="p-6 text-center text-xs text-white/50">
            Aucun classement disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

export function HomeTop10Section({ items, config }: HomeTop10SectionProps) {
  const sectionTitle = config?.section_title ?? "Les plus populaires sur HBO Max";
  const seriesSubtitle = config?.series_subtitle ?? "Top 10 des séries le 24 septembre 2026";
  const moviesSubtitle = config?.movies_subtitle ?? "Top 10 des films le 24 septembre 2026";

  return (
    <section
      id="top-10-france"
      aria-label={sectionTitle || "Les plus populaires sur HBO Max"}
      className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* En-tête de section épuré */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          {sectionTitle ? (
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {sectionTitle}
            </h2>
          ) : (
            <div />
          )}

          <Link
            href="/top-10-france"
            className="inline-flex items-center justify-center self-start sm:self-auto rounded-full bg-[#8197a9] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
          >
            <span>Voir le classement complet</span>
            <ChevronRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        {/* Grille 2 colonnes : Séries à gauche + Films à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <Top10Column subtitle={seriesSubtitle} type="series" items={items} />
          <Top10Column subtitle={moviesSubtitle} type="movie" items={items} />
        </div>
      </div>
    </section>
  );
}
