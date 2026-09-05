import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Play } from "lucide-react";
import { formatDate, youtubeId } from "@/lib/format";
import { getUpcomingReleaseBySlug } from "@/lib/upcoming";
import { UpcomingTrailer } from "@/lib/types";

export const revalidate = 60;

const typeLabels = {
  movie: "Film",
  series: "Série",
  documentary: "Documentaire",
  special: "Spécial"
};

function trailerLabel(source: UpcomingTrailer["source_type"]) {
  if (source === "youtube") return "YouTube";
  if (source === "m3u") return "Flux M3U";
  if (source === "embed") return "Embed";
  return "Vidéo";
}

function TrailerCard({ trailer }: { trailer: UpcomingTrailer }) {
  const id = youtubeId(trailer.url);
  const thumbnail = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;

  return (
    <a
      href={trailer.url}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-lg border border-white/10 bg-[#101318] transition hover:-translate-y-1 hover:border-max-cyan"
    >
      <div className="relative aspect-video bg-white/5">
        {thumbnail ? <img src={thumbnail} alt="" className="h-full w-full object-cover opacity-88" /> : null}
        {!thumbnail ? (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_25%,rgba(142,161,172,.22),transparent_12rem),#151924]" />
        ) : null}
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_40px_rgba(0,0,0,.35)]">
          <Play className="h-5 w-5 fill-current" />
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          {trailerLabel(trailer.source_type)}
        </span>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-black">{trailer.title}</p>
      </div>
    </a>
  );
}

export default async function UpcomingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = await getUpcomingReleaseBySlug(slug);
  if (!release) notFound();

  const trailers = release.upcoming_trailers || [];

  return (
    <main className="bg-[#050608]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {release.banner_url ? <img src={release.banner_url} alt="" className="h-full w-full object-cover opacity-22" /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050608_0%,rgba(5,6,8,.82)_42%,rgba(5,6,8,.28)_100%),linear-gradient(180deg,rgba(5,6,8,.2),#050608_94%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl gap-9 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <Link href="/prochainement" className="inline-flex items-center gap-2 text-sm font-bold text-white/62 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Tous les titres
            </Link>
            <p className="mt-10 text-xs font-black uppercase tracking-[0.24em] text-max-cyan">
              {typeLabels[release.type]} {release.platform ? `sur ${release.platform}` : ""}
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight sm:text-7xl">{release.title}</h1>

            <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/78">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2">
                <MapPin className="h-4 w-4 text-max-cyan" />
                {release.country || "France"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2">
                <CalendarDays className="h-4 w-4 text-max-cyan" />
                {formatDate(release.release_date)}
              </span>
            </div>

            <section className="mt-8 max-w-2xl rounded-lg border border-white/10 bg-black/42 p-5 backdrop-blur">
              <h2 className="text-lg font-black">Résumé du titre</h2>
              <p className="mt-3 text-base leading-8 text-white/72">
                {release.synopsis || "Synopsis à compléter depuis le panel admin."}
              </p>
            </section>

            {release.genres?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {release.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-max-cyan/45 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-max-cyan">
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mx-auto w-full max-w-[330px] lg:max-w-none">
            <div className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.05] shadow-[0_30px_90px_rgba(0,0,0,.45)]">
              {release.poster_url ? (
                <img src={release.poster_url} alt="" className="aspect-[2/3] w-full object-cover" />
              ) : (
                <div className="aspect-[2/3] bg-[radial-gradient(circle_at_50%_20%,rgba(142,161,172,.25),transparent_16rem),#151924]" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/50">Vidéos</p>
            <h2 className="mt-1 text-3xl font-black">Bandes-annonces</h2>
          </div>
          {release.source_url ? (
            <a href={release.source_url} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm font-bold text-white/68 hover:border-white/30 sm:inline-flex">
              Source
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        {trailers.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trailers.map((trailer) => (
              <TrailerCard key={trailer.id} trailer={trailer} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-8 text-white/58">
            Aucune bande-annonce ajoutée pour le moment.
          </div>
        )}
      </section>
    </main>
  );
}
