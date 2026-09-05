import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { PosterCard } from "@/components/PosterCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getLatestArticles, getProductionProjects } from "@/lib/queries";

export const revalidate = 60;

export default async function NewPage() {
  const [articles, projects] = await Promise.all([getLatestArticles(12), getProductionProjects()]);

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6">
      <SectionHeading eyebrow="Nouveautés" title="Derniers contenus ajoutés" text="Films, séries et articles triés par mise à jour ou publication récente." />
      
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Films & séries récents</h2>
          <Link href="/productions" className="text-xs font-bold text-max-cyan hover:text-white">Voir le tracker →</Link>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {projects.slice(0, 14).map((project, index) => <PosterCard key={project.id} project={project} index={index} />)}
        </div>
        {!projects.length ? <p className="text-white/60">Aucune fiche production pour le moment.</p> : null}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Articles récents</h2>
          <Link href="/actualites" className="text-xs font-bold text-max-cyan hover:text-white">Voir toutes les actualités →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {articles.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
        </div>
        {!articles.length ? <p className="text-white/60">Aucun article publié pour le moment.</p> : null}
      </section>
    </main>
  );
}
