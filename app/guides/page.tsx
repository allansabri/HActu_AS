import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticlesByCategory } from "@/lib/queries";

export const revalidate = 60;

export default async function GuidesPage() {
  const all = await getArticlesByCategory();
  const guides = all.filter((article) => /guide|dossier|analyse|explication|top/i.test(article.category));

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6">
      <SectionHeading eyebrow="Guides" title="Guides, dossiers et ordres de visionnage" text="Contenus éditoriaux longs publiés depuis l’admin." />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {guides.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
      </div>
      {!guides.length ? <p className="text-white/60">Aucun guide publié pour le moment.</p> : null}
    </main>
  );
}
