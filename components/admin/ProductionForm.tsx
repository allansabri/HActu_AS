import { upsertProduction } from "@/app/admin/actions";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { ContentType, ProductionProject, ProductionStatus } from "@/lib/types";

const types: Array<[ContentType, string]> = [
  ["series", "Série"],
  ["movie", "Film"],
  ["documentary", "Documentaire"],
  ["special", "Spécial"]
];

const statuses: Array<[ProductionStatus, string]> = [
  ["available", "Disponible"],
  ["upcoming", "Prochainement"],
  ["ended", "Terminé"],
  ["cancelled", "Annulé"],
  ["En développement", "En développement"],
  ["Pré-production", "Pré-production"],
  ["En tournage", "En tournage"],
  ["Post-production", "Post-production"],
  ["Prêt à diffuser", "Prêt à diffuser"],
  ["Sorti", "Sorti"]
];

export function ProductionForm({ project }: { project?: ProductionProject }) {
  const imageValue = project?.poster_url || project?.image_url;

  return (
    <form action={upsertProduction} className="space-y-4 rounded-lg border border-white/10 bg-[#101318]/85 p-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Titre" name="title" defaultValue={project?.title} required />
        <label className="block text-sm text-white/70">
          Type
          <select name="type" defaultValue={project?.type || "series"} className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan">
            {types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm text-white/70">
          Statut
          <select name="status" defaultValue={project?.status || "upcoming"} className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan">
            {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <InputField label="Saison" name="season_number" type="number" defaultValue={project?.season_number?.toString()} placeholder="1, 2, 3..." />
        <InputField label="Nombre d'épisodes" name="episode_count" type="number" defaultValue={project?.episode_count?.toString()} />
      </div>

      <InputField label="Objet suivi dans la production" name="production_label" defaultValue={project?.production_label} placeholder="Ex : Saison 3, film, mini-série..." />
      <TextAreaField label="Synopsis" name="synopsis" rows={4} defaultValue={project?.synopsis} />

      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Casting, séparé par virgules" name="casting" defaultValue={project?.casting?.join(", ")} />
        <InputField label="Réalisation" name="director" defaultValue={project?.director} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <InputField label="Date de sortie France" name="release_date_france" type="date" defaultValue={project?.release_date_france || project?.release_date_estimated} />
        <InputField label="Année de diffusion" name="release_year" type="number" defaultValue={project?.release_year?.toString()} placeholder="2027" />
        <InputField label="Date du prochain épisode" name="next_episode_date" type="date" defaultValue={project?.next_episode_date} />
        <InputField label="Date de sortie estimée" name="release_date_estimated" type="date" defaultValue={project?.release_date_estimated} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Genres, séparés par virgules" name="genres" defaultValue={project?.genres?.join(", ")} placeholder="Drame, fantasy, crime..." />
        <InputField label="Plateforme" name="platform" defaultValue={project?.platform || "Max"} />
      </div>

      <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-max-cyan">Dossier de production</p>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Société(s) de production" name="production_company" defaultValue={project?.production_company} />
          <InputField label="Showrunner / création" name="showrunner" defaultValue={project?.showrunner} />
          <InputField label="Scénaristes, séparés par virgules" name="writers" defaultValue={project?.writers?.join(", ")} />
          <InputField label="Producteurs exécutifs, séparés par virgules" name="executive_producers" defaultValue={project?.executive_producers?.join(", ")} />
          <InputField label="Direction de la photographie" name="cinematography" defaultValue={project?.cinematography} />
          <InputField label="Lieux de tournage, séparés par virgules" name="shooting_locations" defaultValue={project?.shooting_locations?.join(", ")} />
          <InputField label="Début de tournage" name="filming_start_date" type="date" defaultValue={project?.filming_start_date} />
          <InputField label="Fin de tournage" name="filming_end_date" type="date" defaultValue={project?.filming_end_date} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextAreaField label="Notes de production" name="production_notes" rows={4} defaultValue={project?.production_notes} />
          <InputField label="Source / lien de référence" name="source_url" defaultValue={project?.source_url} />
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-max-cyan">Informations professionnelles</p>
        <div className="grid gap-4 md:grid-cols-3">
          <InputField label="Identifiant IMDb" name="imdb_id" defaultValue={project?.imdb_id} placeholder="tt1234567" />
          <InputField label="Titre original" name="original_title" defaultValue={project?.original_title} />
          <InputField label="Durée en minutes" name="runtime_minutes" type="number" defaultValue={project?.runtime_minutes?.toString()} />
          <InputField label="Classification" name="content_rating" defaultValue={project?.content_rating} placeholder="TV-MA, 12..." />
          <InputField label="Pays d'origine" name="country_of_origin" defaultValue={project?.country_of_origin} />
          <InputField label="Langues, séparées par virgules" name="languages" defaultValue={project?.languages?.join(", ")} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextAreaField
            label="Détails techniques"
            name="technical_details"
            rows={4}
            defaultValue={project?.technical_details ? JSON.stringify(project.technical_details, null, 2) : ""}
            placeholder={'{"camera": "ARRI Alexa", "ratio": "2.39:1"}'}
          />
          <TextAreaField label="Anecdotes, une par ligne" name="trivia" rows={4} defaultValue={project?.trivia?.join("\n")} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InputField label="Nom du lien officiel" name="official_link_label" defaultValue={project?.official_links?.[0]?.label} placeholder="Site officiel" />
          <InputField label="URL officielle" name="official_link_url" defaultValue={project?.official_links?.[0]?.url} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InputField label="Image poster" name="poster_url" defaultValue={imageValue} />
        <InputField label="Image bannière" name="banner_url" defaultValue={project?.banner_url} />
        <InputField label="Bande-annonce URL" name="trailer_url" defaultValue={project?.trailer_url} />
      </div>

      <input type="hidden" name="image_url" value={imageValue || ""} />
      <input type="hidden" name="tmdb_id" value={project?.tmdb_id || ""} />
      <input type="hidden" name="tmdb_media_type" value={project?.tmdb_media_type || ""} />
      <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">
        {project ? "Mettre à jour" : "Ajouter la fiche"}
      </button>
    </form>
  );
}
