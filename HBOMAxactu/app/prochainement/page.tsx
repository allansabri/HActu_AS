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
  if (release.type === "documentary") return "Nouveau documentaire";
  return "Nouveau titre";
}

function ReleaseCard({ release }: { release: UpcomingRelease }) {
  return (
    <article className="w-[min(240px,100%)]">
      <Link
        href={`/prochainement/${release.slug}`}
        className="group block aspect-[3/4] w-full overflow-hidden border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_24px_70px_rgba(142,161,172,.16)]"
      >
        {release.poster_url ? (
          <img src={release.poster_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_18%,rgba(142,161,172,.24),transparent_16rem),#151924]" />
        )}
      </Link>
      <p className="mt-3 text-sm font-semibold leading-snug text-white/70">
        {shortDate(release.release_date)} - {fallbackLabel(release)}
      </p>
    </article>
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
              placeholder="Rechercher un film, une série ou un documentaire"
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45"
            />
            <input type="hidden" name="month" value={month} />
            {type !== "all" ? <input type="hidden" name="type" value={type} /> : null}
            <button className="rounded-full bg-white px-5 py-2 text-sm font-black text-black hover:bg-max-cyan">OK</button>
          </form>
        </div>
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
            {(["all", "movie", "series", "documentary"] as Array<ContentType | "all">).map((item) => (
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

        <div className="mt-8 grid justify-items-center gap-x-5 gap-y-8 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
          {releases.map((release, index) => (
            <div key={release.id} className="card-reveal w-full max-w-[240px]" style={{ animationDelay: `${index * 45}ms` }}>
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
