import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticlesByCategory, getCategories } from "@/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export default async function ActualitesPage({
  searchParams
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [categories, allArticles] = await Promise.all([
    getCategories(),
    getArticlesByCategory(searchParams.category)
  ]);
  const query = searchParams.q?.toLowerCase().trim();
  const articles = query
    ? allArticles.filter((article) =>
        `${article.title} ${article.excerpt} ${article.content}`.toLowerCase().includes(query)
      )
    : allArticles;

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6">
      <SectionHeading
        eyebrow="Flux complet"
        title="Actualités & coulisses"
        text="Articles, analyses, coulisses de production et mouvements autour du catalogue Max en France."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium hover:border-max-cyan" href="/actualites">
          Toutes
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium hover:border-max-cyan"
            href={`/actualites?category=${encodeURIComponent(category)}`}
          >
            {category}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
      {!articles.length ? <p className="text-white/60">Aucun article trouvé.</p> : null}
    </main>
  );
}
