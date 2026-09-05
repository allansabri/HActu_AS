import { createArticle, updateArticle } from "@/app/admin/actions";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { slugify } from "@/lib/format";
import { Article } from "@/lib/types";

const statuses = [
  ["draft", "Brouillon"],
  ["published", "Publié"],
  ["scheduled", "Programmé"]
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

  return (
    <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-white/[0.045] p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <InputField label="Titre" name="title" defaultValue={title} required />
        <InputField label="Slug" name="slug" defaultValue={article?.slug || (title ? slugify(title) : "")} placeholder="titre-url" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <InputField label="Catégorie" name="category" defaultValue={article?.category || defaults?.category || "Actualités"} required />
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
      <InputField label="Image URL" name="image_url" defaultValue={article?.image_url} />
      <InputField label="YouTube URL" name="youtube_video_url" defaultValue={article?.youtube_video_url} />
      <div className="grid gap-5 md:grid-cols-2">
        <InputField label="SEO title" name="seo_title" defaultValue={article?.seo_title || article?.title} />
        <InputField label="Contenu lié" name="related_content" defaultValue={article?.related_content} placeholder="Slug, titre ou URL liée" />
      </div>
      <TextAreaField label="Extrait SEO" name="excerpt" rows={3} defaultValue={article?.excerpt} />
      <TextAreaField label="Meta description" name="seo_description" rows={3} defaultValue={article?.seo_description || article?.excerpt} />
      <TextAreaField label="Contenu" name="content" rows={16} defaultValue={article?.content || defaults?.content} required />
      <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">
        {article ? "Mettre à jour" : "Créer l'article"}
      </button>
    </form>
  );
}
