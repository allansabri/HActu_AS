import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/SectionHeading";
import { formatDate } from "@/lib/format";
import { findTmdbTitle, getTmdbTitleDetails, TmdbMediaType } from "@/lib/tmdb";
import { ContentType } from "@/lib/types";

export const revalidate = 3600;

function isContentType(value: string): value is ContentType {
  return value === "movie" || value === "series" || value === "documentary" || value === "special";
}

function mediaTypeFromContent(type: ContentType): TmdbMediaType {
  return type === "movie" || type === "documentary" || type === "special" ? "movie" : "tv";
}

export default async function TitleDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  if (!isContentType(resolvedParams.type)) notFound();

  const titleQuery = resolvedSearch.title || resolvedParams.slug.replace(/-/g, " ");
  const found = await findTmdbTitle(resolvedParams.type, titleQuery);
  if (!found) notFound();

  const details = await getTmdbTitleDetails(mediaTypeFromContent(resolvedParams.type), found.tmdbId);

  return (
    <main>
      <section className="relative min-h-[560px] overflow-hidden">
        <img
          src={details.backdropUrl || details.posterUrl || "/max-reference-bg.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-max-black via-max-black/75 to-black/35" />
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-end gap-8 px-4 pb-12 sm:px-6 md:grid-cols-[220px_1fr]">
          <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-glow md:block">
            {details.posterUrl ? (
              <img src={details.posterUrl} alt="" className="aspect-[2/3] w-full object-cover" />
            ) : null}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-max-cyan">
              {resolvedParams.type === "movie" ? "Film" : "Série"}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-none tracking-tight md:text-6xl">
              {details.title}
            </h1>
            {details.tagline ? <p className="mt-4 text-xl text-white/70">{details.tagline}</p> : null}
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/62">
              {details.releaseDate ? <span>{formatDate(details.releaseDate)}</span> : null}
              {details.genres.map((genre) => (
                <span key={genre} className="rounded-full border border-white/10 px-3 py-1">{genre}</span>
              ))}
              {details.seasonCount ? <span>{details.seasonCount} saison(s)</span> : null}
              {details.episodeCount ? <span>{details.episodeCount} épisode(s)</span> : null}
              {details.runtime ? <span>{details.runtime} min</span> : null}
              {details.status ? <span>{details.status}</span> : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <SectionHeading title="Synopsis" />
            <p className="text-lg leading-8 text-white/70">{details.overview || "Aucun synopsis disponible pour le moment."}</p>
          </div>
          <aside className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-xl font-black">Équipe créative</h2>
            <div className="mt-4 space-y-3">
              {details.crew.length ? (
                details.crew.map((person) => (
                  <Link key={`${person.id}-${person.role}`} href={`/personnes/${person.id}`} className="flex items-center gap-3 rounded-md p-2 hover:bg-white/5">
                    {person.profileUrl ? <img src={person.profileUrl} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-white/10" />}
                    <span>
                      <span className="block font-semibold">{person.name}</span>
                      <span className="text-xs text-white/45">{person.role}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-white/60">Non renseigné sur TMDB.</p>
              )}
            </div>
          </aside>
        </section>

        {details.seasons.length ? (
          <section className="mt-12">
            <SectionHeading title="Saisons" text="Images, dates et résumés des saisons disponibles sur TMDB." />
            <div className="grid gap-5 md:grid-cols-2">
              {details.seasons.map((season) => (
                <article key={season.id} className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-[110px_1fr]">
                  {season.posterUrl ? <img src={season.posterUrl} alt="" className="aspect-[2/3] w-full rounded-md object-cover" /> : <div className="aspect-[2/3] rounded-md bg-white/10" />}
                  <div>
                    <h3 className="text-xl font-black">{season.name}</h3>
                    <p className="mt-1 text-sm text-white/45">
                      {season.episodeCount} épisode(s) {season.airDate ? `• ${formatDate(season.airDate)}` : ""}
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">
                      {season.overview || "Résumé indisponible."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <SectionHeading title="Casting" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.cast.map((person) => (
              <Link key={person.id} href={`/personnes/${person.id}`} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 hover:border-max-cyan/60">
                {person.profileUrl ? <img src={person.profileUrl} alt="" className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-white/10" />}
                <span className="min-w-0">
                  <span className="block truncate font-bold">{person.name}</span>
                  <span className="block truncate text-sm text-white/50">{person.role}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
