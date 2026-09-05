"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { youtubeId } from "@/lib/format";
import { TmdbTitleDetails } from "@/lib/tmdb";
import { Article, ProductionProjectPro } from "@/lib/types";

const tabs = [
  ["cast", "Casting"],
  ["crew", "Équipe"],
  ["images", "Images"],
  ["videos", "Vidéos"],
  ["details", "Détails"],
  ["episodes", "Épisodes"],
  ["companies", "Sociétés"],
  ["news", "Actualités"]
] as const;

type TabId = (typeof tabs)[number][0];

export function ProductionProTabs({
  data,
  tmdb,
  articles
}: {
  data: ProductionProjectPro;
  tmdb: TmdbTitleDetails | null;
  articles: Article[];
}) {
  const [active, setActive] = useState<TabId>("cast");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const project = data.project;

  const cast = data.credits.filter((credit) => credit.department === "cast");
  const crew = data.credits.filter((credit) => credit.department !== "cast");
  const images = data.media.filter((item) => ["image", "poster", "backdrop"].includes(item.media_type));
  const videos = data.media.filter((item) => item.media_type === "video");
  const seasons = useMemo(() => {
    const source = data.episodes.length
      ? data.episodes
      : (tmdb?.seasons || []).map((season) => ({
          id: String(season.id),
          project_id: project.id,
          imdb_id: null,
          tmdb_id: season.id,
          season_number: season.seasonNumber,
          episode_number: 0,
          title: season.name,
          synopsis: season.overview,
          air_date: season.airDate,
          image_url: season.posterUrl
        }));
    return Array.from(new Set(source.map((episode) => episode.season_number)))
      .sort((a, b) => b - a)
      .map((season) => ({ season, episodes: source.filter((episode) => episode.season_number === season) }));
  }, [data.episodes, tmdb?.seasons, project.id]);

  return (
    <>
      <section className="overflow-hidden border border-white/10 bg-[#0b0e14]">
        <div className="flex overflow-x-auto border-b border-white/10">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`shrink-0 border-b-2 px-4 py-4 text-sm font-bold ${active === id ? "border-max-cyan text-max-cyan" : "border-transparent text-white/58 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 md:p-7">
          {active === "cast" ? (
            <div>
              <h2 className="text-2xl font-black">Casting</h2>
              <p className="mt-1 text-sm text-white/48">{cast.length || tmdb?.cast.length || project.casting?.length || 0} membre(s)</p>
              <div className="mt-5 divide-y divide-white/10">
                {(cast.length ? cast : tmdb?.cast || []).map((person: any) => (
                  <div key={person.id || person.tmdb_person_id || person.name} className="grid grid-cols-[50px_1fr_auto] items-center gap-4 py-3">
                    {person.profile_url || person.profileUrl ? <img src={person.profile_url || person.profileUrl} alt="" className="h-12 w-12 object-cover" /> : <div className="h-12 w-12 bg-white/8" />}
                    <div>
                      <Link href={person.tmdb_person_id || person.id ? `/personnes/${person.tmdb_person_id || person.id}` : "#"} className="font-black text-max-cyan hover:text-white">{person.name}</Link>
                      <p className="mt-1 text-sm text-white/58">{person.character_name || person.role || "Casting"}</p>
                    </div>
                    <span className="text-sm text-white/42">{person.episode_count ? `${person.episode_count} ép.` : ""}</span>
                  </div>
                ))}
                {!cast.length && !tmdb?.cast.length ? (project.casting || []).map((name) => <div key={name} className="py-3 font-bold">{name}</div>) : null}
              </div>
            </div>
          ) : null}

          {active === "crew" ? (
            <div>
              <h2 className="text-2xl font-black">Équipe créative et technique</h2>
              <div className="mt-5 divide-y divide-white/10">
                {(crew.length ? crew : tmdb?.crew || []).map((person: any) => (
                  <div key={`${person.id || person.tmdb_person_id}-${person.job || person.role}`} className="grid grid-cols-[50px_1fr_auto] items-center gap-4 py-3">
                    {person.profile_url || person.profileUrl ? <img src={person.profile_url || person.profileUrl} alt="" className="h-12 w-12 object-cover" /> : <div className="h-12 w-12 bg-white/8" />}
                    <div>
                      <p className="font-black text-max-cyan">{person.name}</p>
                      <p className="mt-1 text-sm text-white/58">{person.job || person.role || person.department}</p>
                    </div>
                    <span className="text-sm text-white/42">{person.years || ""}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {active === "images" ? (
            <div>
              <h2 className="text-2xl font-black">Images</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                  <button key={image.id} type="button" onClick={() => setLightbox(image.url)} className="aspect-video overflow-hidden border border-white/10 bg-white/5">
                    <img src={image.thumbnail_url || image.url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {active === "videos" ? (
            <div>
              <h2 className="text-2xl font-black">Vidéos</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {videos.map((video) => {
                  const id = youtubeId(video.url);
                  return (
                    <a key={video.id} href={video.url} target="_blank" rel="noreferrer" className="border border-white/10 bg-white/[0.035]">
                      {id ? <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" className="aspect-video w-full object-cover" /> : <div className="aspect-video bg-white/5" />}
                      <p className="p-4 font-black">{video.title || "Vidéo"}</p>
                    </a>
                  );
                })}
                {!videos.length ? <p className="text-white/50">Aucune vidéo enregistrée.</p> : null}
              </div>
            </div>
          ) : null}

          {active === "details" ? (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-black">Synopsis</h2>
                <p className="mt-4 max-w-4xl whitespace-pre-wrap leading-8 text-white/72">{project.synopsis || tmdb?.overview || "Aucun synopsis."}</p>
              </section>
              <section>
                <h3 className="text-xl font-black">Informations techniques</h3>
                <dl className="mt-3 divide-y divide-white/10 border-y border-white/10">
                  {[
                    ["Durée", project.runtime_minutes || tmdb?.runtime ? `${project.runtime_minutes || tmdb?.runtime} minutes` : null],
                    ["Pays d'origine", project.country_of_origin],
                    ["Langues", project.languages?.join(", ")],
                    ["Classification", project.content_rating],
                    ...Object.entries(project.technical_details || {})
                  ].filter(([, value]) => value).map(([label, value]) => (
                    <div key={label} className="grid gap-2 py-3 sm:grid-cols-[220px_1fr]">
                      <dt className="font-black">{label}</dt><dd className="text-white/65">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section>
                <h3 className="text-xl font-black">Historique de production</h3>
                <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
                  {data.statusHistory.map((item) => (
                    <div key={item.id} className="grid gap-2 py-3 sm:grid-cols-[220px_160px_1fr]">
                      <span className="font-black text-max-cyan">{item.status}</span>
                      <span className="text-white/58">{item.status_date || "Date inconnue"}</span>
                      <span className="text-white/58">{item.details}</span>
                    </div>
                  ))}
                </div>
              </section>
              {project.shooting_locations?.length ? <section><h3 className="text-xl font-black">Lieux de tournage</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-white/68">{project.shooting_locations.map((location) => <li key={location}>{location}</li>)}</ul></section> : null}
            </div>
          ) : null}

          {active === "episodes" ? (
            <div>
              <h2 className="text-2xl font-black">Épisodes et saisons</h2>
              <div className="mt-5 space-y-8">
                {seasons.map(({ season, episodes }) => (
                  <section key={season}>
                    <h3 className="border-b border-white/10 pb-3 text-lg font-black">Saison {season}</h3>
                    <div className="divide-y divide-white/10">
                      {episodes.map((episode) => (
                        <article key={episode.id} className="grid gap-4 py-4 sm:grid-cols-[180px_1fr]">
                          {episode.image_url ? <img src={episode.image_url} alt="" className="aspect-video w-full object-cover" /> : <div className="aspect-video bg-white/5" />}
                          <div>
                            <h4 className="text-lg font-black text-max-cyan">{episode.title || `Épisode ${episode.episode_number}`}</h4>
                            <p className="mt-1 text-sm text-white/55">Saison {season}{episode.episode_number ? `, épisode ${episode.episode_number}` : ""} {episode.air_date ? `· ${episode.air_date}` : ""}</p>
                            {episode.synopsis ? <p className="mt-3 leading-7 text-white/68">{episode.synopsis}</p> : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
                {!seasons.length ? <p className="text-white/50">Aucun épisode enregistré.</p> : null}
              </div>
            </div>
          ) : null}

          {active === "companies" ? (
            <div>
              <h2 className="text-2xl font-black">Sociétés</h2>
              <div className="mt-5 divide-y divide-white/10">
                {data.companies.map((company) => (
                  <Link key={company.id} href={`/productions/entreprises/${company.slug}`} className="grid grid-cols-[58px_1fr] gap-4 py-4 hover:text-max-cyan">
                    {company.logo_url ? <img src={company.logo_url} alt="" className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-white/8" />}
                    <div><h3 className="font-black">{company.name}</h3><p className="mt-1 text-sm text-white/52">{company.company_type || "Société liée"}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {active === "news" ? (
            <div>
              <h2 className="text-2xl font-black">Actualités liées</h2>
              <div className="mt-5 divide-y divide-white/10">
                {articles.map((article) => <Link key={article.id} href={`/actualites/${article.slug}`} className="block py-4"><h3 className="font-black text-max-cyan">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-white/58">{article.excerpt}</p></Link>)}
                {!articles.length ? <p className="text-white/50">Aucune actualité liée.</p> : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {lightbox ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4" onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)} className="absolute right-5 top-5 p-2 text-white"><X className="h-7 w-7" /></button>
          <img src={lightbox} alt="" className="max-h-[88vh] max-w-[94vw] object-contain" />
        </div>
      ) : null}
    </>
  );
}
