import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticlesByCategory, getCategories } from "@/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [categories, allArticles] = await Promise.all([
    getCategories(),
    getArticlesByCategory(params.category)
  ]);
  const query = params.q?.toLowerCase().trim();
  const articles = query
    ? allArticles.filter((article) =>
        `${article.title} ${article.excerpt} ${article.content}`.toLowerCase().includes(query)
      )
    : allArticles;

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Actualités"
        title="Toutes les actualités"
        text="News, coulisses, analyses et tout ce qui se passe autour de Max, HBO et Warner Bros. Discovery."
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        <Link className="rounded-full border border-white/10 px-3.5 py-1 text-xs font-semibold hover:border-white/40" href="/actualites">Tout</Link>
        {categories.map((category) => (
          <Link
            key={category}
            className="rounded-full border border-white/10 px-3.5 py-1 text-xs font-semibold hover:border-white/40"
            href={`/actualites?category=${encodeURIComponent(category)}`}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
      {!articles.length ? <p className="text-white/60 mt-6">Aucun article trouvé.</p> : null}
    </main>
  );
}
