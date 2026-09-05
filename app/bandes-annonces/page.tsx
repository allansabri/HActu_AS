import { SectionHeading } from "@/components/SectionHeading";
import { youtubeId } from "@/lib/format";
import { getTrailerArticles } from "@/lib/queries";

export const revalidate = 60;

export default async function TrailersPage() {
  const articles = await getTrailerArticles(30);

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6">
      <SectionHeading
        eyebrow="Galerie vidéo"
        title="Bandes-annonces"
        text="Tous les players YouTube reliés aux articles publiés."
      />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {articles.map((article, index) => {
          const id = youtubeId(article.youtube_video_url);
          return (
            <article key={article.id} style={{ animationDelay: `${index * 55}ms` }} className="card-reveal relative z-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] transition-all duration-300 ease-in-out hover:z-10 hover:scale-105 hover:border-white/25 hover:shadow-[0_24px_70px_rgba(20,80,180,.3)]">
              {id ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${id}`}
                  title={article.title}
                  allowFullScreen
                />
              ) : null}
              <div className="p-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-max-cyan">{article.category}</p>
                <h2 className="mt-1.5 text-base font-bold leading-tight">{article.title}</h2>
              </div>
            </article>
          );
        })}
      </div>
      {!articles.length ? <p className="text-white/60">Aucune vidéo pour le moment.</p> : null}
    </main>
  );
}
