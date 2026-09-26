"use client";

import { useState } from "react";
import { createArticle, updateArticle } from "@/app/admin/actions";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { slugify } from "@/lib/format";
import { Article } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";
import { defaultAuthors } from "@/lib/authors-config";

const statuses = [
  ["draft", "Brouillon"],
  ["published", "Publié"],
  ["scheduled", "Programmé"]
];

const PRESET_CATEGORIES = [
  { id: "cinema", label: "Cinéma", desc: "Films, sorties cinéma & box-office" },
  { id: "series", label: "Séries", desc: "Nouvelles saisons & épisodes" },
  { id: "hbo", label: "HBO", desc: "Productions & créations HBO" },
  { id: "hbo-max", label: "HBO Max", desc: "Exclusivités & catalogue Max" },
  { id: "international", label: "Programmes internationaux", desc: "Créations mondiales" },
  { id: "actualites", label: "Actualités", desc: "News générales Max" }
];

export function ArticleForm({
  article,
  defaults
}: {
  article?: Article;
  defaults?: Record<string, string | undefined>;
}) {
  const action = article ? updateArticle.bind(null, article.id) : createArticle;
  const title = article?.title || defaults?.title || "";

  // Initialisation des catégories sélectionnées
  const initialCategoryStr = article?.category || defaults?.category || "Actualités";
  const initialSelectedList = initialCategoryStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialSelectedList.length === 0) return ["Actualités"];
    return initialSelectedList;
  });

  const [customCategory, setCustomCategory] = useState<string>("");

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(label)) {
        const next = prev.filter((c) => c !== label);
        return next.length > 0 ? next : ["Actualités"];
      } else {
        return [...prev, label];
      }
    });
  };

  return (
    <form action={action} className="space-y-6 rounded-lg border border-white/10 bg-white/[0.045] p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <InputField label="Titre" name="title" defaultValue={title} required />
        <InputField label="Slug" name="slug" defaultValue={article?.slug || (title ? slugify(title) : "")} placeholder="titre-url" />
      </div>

      {/* SÉLECTEUR MULTI-CATÉGORIES */}
      <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <span>Catégories de l&apos;article</span>
            <span className="text-xs font-normal text-white/50">(Cochez une ou plusieurs catégories)</span>
          </label>
          <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
            {selectedCategories.length} sélectionnée{selectedCategories.length > 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-xs text-white/60 mb-4 leading-relaxed">
          Chaque article publié apparaîtra <strong>automatiquement</strong> dans la section <span className="text-white font-semibold">« Les dernières actualités »</span> sur la page d&apos;accueil, ainsi que dans chacune des sections et filtres correspondants que vous cochez ci-dessous (ex : Cinéma, HBO, HBO Max, etc.).
        </p>

        {/* Grille des badges / cases à cocher cliquables */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESET_CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.label);
            return (
              <label
                key={cat.id}
                className={`relative flex flex-col justify-between p-3 rounded-lg border transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-max-blue/15 border-max-cyan text-white shadow-[0_0_12px_rgba(0,229,255,0.18)]"
                    : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={cat.label}
                  checked={isChecked}
                  onChange={() => toggleCategory(cat.label)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${isChecked ? "text-cyan-300" : "text-white"}`}>
                    {cat.label}
                  </span>
                  <div
                    className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                      isChecked
                        ? "bg-max-cyan border-max-cyan text-black"
                        : "border-white/25 bg-black/40"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-[10px] text-white/45 leading-tight line-clamp-2">
                  {cat.desc}
                </span>
              </label>
            );
          })}
        </div>

        {/* Champ catégorie supplémentaire / personnalisée */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs text-white/60 shrink-0">
            Autre catégorie personnalisée (optionnel) :
          </label>
          <input
            type="text"
            name="custom_category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Ex : Documentaire, Événement spécial..."
            className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-max-cyan"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Auteur de l'article
          </label>
          <input
            type="text"
            name="author_name"
            list="authors-datalist"
            defaultValue={article?.author_name || "Allan"}
            placeholder="Ex: Allan, Thomas Renard..."
            className="w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white placeholder-white/40 outline-none focus:border-max-cyan"
          />
          <datalist id="authors-datalist">
            {defaultAuthors.map((author) => (
              <option key={author.id} value={author.name} />
            ))}
          </datalist>
        </div>
        <label className="block text-sm text-white/70">
          Statut
          <select name="status" defaultValue={article?.status || defaults?.status || "draft"} className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan">
            {statuses.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <InputField label="Date de publication" name="published_at" type="datetime-local" defaultValue={article?.published_at?.slice(0, 16)} />
      </div>

      <InputField
        label="Image principale Hero (URL)"
        name="image_url"
        defaultValue={article?.image_url}
        placeholder="https://image.tmdb.org/... ou URL d'image directe"
      />
      <InputField
        label="Vidéo intégrée (YouTube, flux HLS / .m3u8, ou fichier MP4)"
        name="youtube_video_url"
        defaultValue={article?.youtube_video_url}
        placeholder="https://www.youtube.com/watch?v=... ou https://domaine.com/flux.m3u8 ou .mp4"
      />
      <div className="grid gap-5 md:grid-cols-2">
        <InputField label="SEO title" name="seo_title" defaultValue={article?.seo_title || article?.title} />
        <InputField label="Contenu lié" name="related_content" defaultValue={article?.related_content} placeholder="Slug, titre ou URL liée" />
      </div>
      <TextAreaField label="Extrait / Chapô d'introduction" name="excerpt" rows={3} defaultValue={article?.excerpt} placeholder="Bref résumé accrocheur en tête d'article..." />
      <TextAreaField label="Meta description" name="seo_description" rows={3} defaultValue={article?.seo_description || article?.excerpt} />
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-white/80">Contenu de l&apos;article</label>
          <span className="text-xs text-white/40">
            Astuce : insérez une image avec <code className="text-max-cyan">![Légende](URL)</code> ou collez une URL d&apos;image seule sur une ligne.
          </span>
        </div>
        <TextAreaField
          label=""
          name="content"
          rows={16}
          defaultValue={article?.content || defaults?.content}
          required
          placeholder="Rédigez ici le corps de l'article..."
        />
      </div>
      <button className="rounded-md bg-max-blue px-6 py-3.5 font-bold text-black hover:bg-cyan-300 transition-colors cursor-pointer">
        {article ? "Mettre à jour l'article" : "Créer l'article"}
      </button>
    </form>
  );
}
