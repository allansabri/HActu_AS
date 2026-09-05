import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { ContentType, UpcomingRelease } from "@/lib/types";
import { currentMonthKey, getUpcomingMonths, getUpcomingReleases, monthLabel } from "@/lib/upcoming";

export const revalidate = 60;

const typeLabels: Record<ContentType | "all", string> = {
  all: "Tous",
  movie: "Films",
  series: "Séries",
  sport: "Sport",
  documentary: "Documentaires",
  special: "Spéciaux"
};

function searchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function filterHref(params: { q?: string | null; type?: string | null; month?: string | null }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.type && params.type !== "all") query.set("type", params.type);
  if (params.month) query.set("month", params.month);
  const suffix = query.toString();
  return `/prochainement${suffix ? `?${suffix}` : ""}`;
}

function shortDate(date?: string | null) {
  if (!date) return "date à confirmer";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(new Date(date));
}

function fallbackLabel(release: UpcomingRelease) {
  if (release.release_label) return release.release_label;
  if (release.type === "series") return "Nouvelle série";
  if (release.type === "movie") return "Nouveau film";
  if (release.type === "sport") return "Événement sport";
  if (release.type === "documentary") return "Nouveau documentaire";
  return "Nouveau titre";
}

function getAvailableBadge(release: UpcomingRelease) {
  if (!release.release_date) return null;
  const releaseDate = new Date(release.release_date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24));
  if (diffDays >= 0 && diffDays < 5) {
    return "Disponible";
  }
  return null;
}

function ReleaseCard({ release }: { release: UpcomingRelease }) {
  const availableBadge = getAvailableBadge(release);
  const isSport = release.type === "sport";

  return (
    <article className="w-full max-w-[220px]">
      <Link
        href={`/prochainement/${release.slug}`}
        className="group block w-full overflow-hidden rounded-[8px] border border-white/10 bg-white/5 transition-all duration-200"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] border border-white/10 bg-white/5 group-hover:outline group-hover:outline-[3px] group-hover:outline-white group-hover:outline-offset-[2px]">
          {release.poster_url ? (
            <img
              src={release.poster_url}
              alt=""
              className="h-full w-full object-cover transition duration-300"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_50%_18%,rgba(142,161,172,.24),transparent_16rem),#151924]" />
          )}
          {availableBadge && (
            <div className="absolute top-2 right-2 rounded bg-zinc-900/90 px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
              {availableBadge}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 px-1">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60">{fallbackLabel(release)}</p>
        <h3 className="mt-1 text-sm font-black leading-tight line-clamp-2">{release.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
          <span>{shortDate(release.release_date)}</span>
          {release.release_time && <span className="text-white/40">• {release.release_time}</span>}
        </div>
        {availableBadge && !isSport && (
          <span className="mt-1.5 inline-block rounded bg-zinc-900 px-2 py-px text-[10px] font-medium text-white/80">Disponible</span>
        )}
      </div>
    </article>
  );
}

function LandscapeCard({ release }: { release: UpcomingRelease }) {
  const availableBadge = getAvailableBadge(release);
  const timeBadge = release.release_time ? release.release_time : null;

  return (
    <Link
      href={`/prochainement/${release.slug}`}
      className="group flex gap-4 rounded-[10px] border border-white/10 bg-white/[0.035] p-3 transition hover:border-white/40"
    >
      <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
        {release.poster_url ? (
          <img src={release.poster_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
        {availableBadge && (
          <div className="absolute bottom-1 left-1 rounded bg-zinc-900/90 px-1.5 py-px text-[9px] font-bold text-white">
            Disponible
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{fallbackLabel(release)}</p>
        <h4 className="mt-0.5 text-base font-black leading-tight line-clamp-2">{release.title}</h4>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/65">
          <span>{shortDate(release.release_date)}</span>
          {timeBadge && <span className="rounded bg-zinc-800 px-1.5 py-px text-[10px]">{timeBadge}</span>}
        </div>
      </div>
    </Link>
  );
}

export default async function ProchainementPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const q = searchParamValue(params.q) || "";
  const type = searchParamValue(params.type) || "all";
  const availableMonths = await getUpcomingMonths({ q, type: type as ContentType | "all" });
  const month = searchParamValue(params.month) || availableMonths[0] || currentMonthKey();
  const releases = await getUpcomingReleases({ q, type: type as ContentType | "all", month });
  const featured = releases[0];

  // Fetch all (without month) for special sections
  const allReleases = await getUpcomingReleases({ q, type: type as ContentType | "all", month: null });

  // Cette semaine
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  function isThisWeek(release: any) {
    const dateStr = release?.release_date;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= weekStart && d <= weekEnd;
  }

  const thisWeekReleases = allReleases.filter(isThisWeek).slice(0, 6);
  const sportReleases = allReleases.filter(r => r.type === "sport").slice(0, 6);

  return (
    <main>
      <section className="relative -mt-[1px] overflow-hidden border-b border-white/10 bg-[#050608]">
        <div className="absolute inset-0">
          {featured?.banner_url ? (
            <img src={featured.banner_url} alt="" className="h-full w-full object-cover opacity-24" />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_10%,rgba(142,161,172,.34),transparent_20rem),radial-gradient(circle_at_70%_12%,rgba(91,93,255,.26),transparent_22rem),linear-gradient(180deg,rgba(5,6,8,.42),#050608_78%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[430px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-max-cyan">Prochainement sur Max</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">Titres, dates et bandes-annonces à venir</h1>
          <form action="/prochainement" className="mt-9 flex w-full max-w-3xl items-center gap-3 rounded-full border border-white/15 bg-black/58 px-5 py-3 shadow-[0_22px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
            <Search className="h-5 w-5 shrink-0 text-white/58" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Rechercher un film, une série, du sport..."
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45"
            />
            <input type="hidden" name="month" value={month} />
            {type !== "all" ? <input type="hidden" name="type" value={type} /> : null}
            <button className="rounded-full bg-white px-5 py-2 text-sm font-black text-black hover:bg-max-cyan">OK</button>
          </form>
        </div>

        {/* Cette semaine */}
        {thisWeekReleases.length > 0 && (
          <section className="mt-14 rounded-2xl border border-white/10 bg-[#0a0c14] p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="lg:w-48 shrink-0">
                <div className="sticky top-8">
                  <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[2px] text-white/60">ÉDITION SPÉCIALE</div>
                  <div className="mt-3 text-3xl font-black tracking-tight">Cette semaine</div>
                  <p className="mt-1 text-sm text-white/50">Sorties attendues cette semaine sur Max.</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {thisWeekReleases.map((release) => (
                  <LandscapeCard key={release.id} release={release} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sport */}
        {sportReleases.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-[#0a0c14] p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="lg:w-48 shrink-0">
                <div className="sticky top-8">
                  <div className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-[2px] text-emerald-400">SPORT</div>
                  <div className="mt-3 text-3xl font-black tracking-tight">Sport sur Max</div>
                  <p className="mt-1 text-sm text-white/50">Événements et diffusions sportives à venir.</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sportReleases.map((release) => (
                  <LandscapeCard key={release.id} release={release} />
                ))}
              </div>
            </div>
          </section>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/55">Je m’intéresse aux titres qui sortent en</p>
            <details className="group relative mt-2 inline-block">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-bold capitalize text-white/72 hover:border-white/30">
                {monthLabel(month)}
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 z-20 mt-2 min-w-64 overflow-hidden rounded-lg border border-white/10 bg-[#101318] p-2 shadow-[0_24px_80px_rgba(0,0,0,.45)]">
                {(availableMonths.length ? availableMonths : [month]).map((item) => (
                  <Link
                    key={item}
                    href={filterHref({ q, type, month: item })}
                    className={`block rounded-md px-4 py-2.5 text-sm font-bold capitalize ${
                      item === month ? "bg-max-cyan text-black" : "text-white/72 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    {monthLabel(item)}
                  </Link>
                ))}
              </div>
            </details>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "movie", "series", "sport", "documentary"] as Array<ContentType | "all">).map((item) => (
              <Link
                key={item}
                href={filterHref({ q, type: item, month })}
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                  type === item || (!type && item === "all")
                    ? "border-max-cyan bg-max-cyan text-black"
                    : "border-white/12 bg-white/[0.04] text-white/72 hover:border-white/30"
                }`}
              >
                {typeLabels[item]}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid justify-items-center gap-4 [grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
          {releases.map((release, index) => (
            <div key={release.id} className="card-reveal w-full" style={{ animationDelay: `${index * 30}ms` }}>
              <ReleaseCard release={release} />
            </div>
          ))}
        </div>

        {!releases.length ? (
          <div className="mt-8 rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-10 text-center">
            <h3 className="text-2xl font-black">Aucun titre trouvé</h3>
            <p className="mt-2 text-white/60">Change le mois, le filtre ou la recherche.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
