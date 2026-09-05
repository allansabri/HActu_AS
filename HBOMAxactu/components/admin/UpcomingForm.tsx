"use client";

import { Plus, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { useState } from "react";
import { upsertUpcomingRelease } from "@/app/admin/actions";
import { UpcomingRelease, UpcomingTrailer, UpcomingTrailerSource } from "@/lib/types";

type TrailerDraft = Pick<UpcomingTrailer, "title" | "url" | "source_type"> & { key: string };

function sourceFromUrl(url: string): UpcomingTrailerSource {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes(".m3u") || url.includes(".m3u8")) return "m3u";
  return "video";
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-white/70">
      {label}
      {children}
    </label>
  );
}

const inputClass = "mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan";

export function UpcomingForm({ release }: { release?: UpcomingRelease }) {
  const [trailers, setTrailers] = useState<TrailerDraft[]>(
    release?.upcoming_trailers?.length
      ? release.upcoming_trailers.map((trailer) => ({
          key: trailer.id,
          title: trailer.title,
          url: trailer.url,
          source_type: trailer.source_type
        }))
      : [{ key: "new-0", title: "", url: "", source_type: "youtube" }]
  );

  function updateTrailer(index: number, patch: Partial<TrailerDraft>) {
    setTrailers((current) =>
      current.map((trailer, trailerIndex) => (trailerIndex === index ? { ...trailer, ...patch } : trailer))
    );
  }

  return (
    <form action={upsertUpcomingRelease} className="space-y-4 rounded-lg border border-white/10 bg-[#101318]/85 p-4">
      {release ? <input type="hidden" name="id" value={release.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titre">
          <input name="title" required defaultValue={release?.title || ""} className={inputClass} />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={release?.slug || ""} placeholder="auto si vide" className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Type">
          <select name="type" defaultValue={release?.type || "series"} className={inputClass}>
            <option value="series">Série</option>
            <option value="movie">Film</option>
            <option value="documentary">Documentaire</option>
            <option value="special">Spécial</option>
          </select>
        </Field>
        <Field label="Date France">
          <input name="release_date" type="date" defaultValue={release?.release_date || ""} className={inputClass} />
        </Field>
        <Field label="Libellé affiche">
          <input name="release_label" defaultValue={release?.release_label || ""} placeholder="Saison 3, Nouvelle série..." className={inputClass} />
        </Field>
        <Field label="Pays">
          <input name="country" defaultValue={release?.country || "France"} className={inputClass} />
        </Field>
        <Field label="Plateforme">
          <input name="platform" defaultValue={release?.platform || "Max"} className={inputClass} />
        </Field>
      </div>

      <Field label="Synopsis">
        <textarea name="synopsis" rows={5} defaultValue={release?.synopsis || ""} className={inputClass} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Genres, séparés par des virgules">
          <input name="genres" defaultValue={release?.genres?.join(", ") || ""} className={inputClass} />
        </Field>
        <Field label="Source">
          <input name="source_url" defaultValue={release?.source_url || ""} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Affiche">
          <input name="poster_url" defaultValue={release?.poster_url || ""} className={inputClass} />
        </Field>
        <Field label="Bannière">
          <input name="banner_url" defaultValue={release?.banner_url || ""} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="TMDB ID">
          <input name="tmdb_id" type="number" defaultValue={release?.tmdb_id || ""} className={inputClass} />
        </Field>
        <Field label="Type TMDB">
          <select name="tmdb_media_type" defaultValue={release?.tmdb_media_type || ""} className={inputClass}>
            <option value="">Aucun</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
          </select>
        </Field>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black">Bandes-annonces</h3>
          <button
            type="button"
            onClick={() => setTrailers((current) => [...current, { key: `new-${Date.now()}`, title: "", url: "", source_type: "youtube" }])}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-bold hover:border-max-cyan"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {trailers.map((trailer, index) => (
            <div key={trailer.key} className="grid gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 md:grid-cols-[1fr_1.3fr_150px_auto]">
              <input
                name="trailer_title"
                value={trailer.title}
                onChange={(event) => updateTrailer(index, { title: event.target.value })}
                placeholder="Titre de la vidéo"
                className={inputClass}
              />
              <input
                name="trailer_url"
                value={trailer.url}
                onChange={(event) => updateTrailer(index, { url: event.target.value, source_type: sourceFromUrl(event.target.value) })}
                placeholder="YouTube, m3u8 ou vidéo"
                className={inputClass}
              />
              <select
                name="trailer_source_type"
                value={trailer.source_type}
                onChange={(event) => updateTrailer(index, { source_type: event.target.value as UpcomingTrailerSource })}
                className={inputClass}
              >
                <option value="youtube">YouTube</option>
                <option value="m3u">M3U</option>
                <option value="video">Vidéo</option>
                <option value="embed">Embed</option>
              </select>
              <button
                type="button"
                onClick={() => setTrailers((current) => current.filter((_, trailerIndex) => trailerIndex !== index))}
                className="mt-2 inline-flex h-12 items-center justify-center rounded-md border border-red-300/30 px-3 text-red-200 hover:bg-red-500/10"
                aria-label="Supprimer la bande-annonce"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-md bg-max-blue px-4 py-3 font-black text-black hover:bg-max-cyan">
        Enregistrer
      </button>
    </form>
  );
}
