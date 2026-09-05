import { notFound } from "next/navigation";
import { Metadata } from "next";
import { formatDate, youtubeId } from "@/lib/format";
import { getArticleBySlug } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt || article.content.slice(0, 155),
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.image_url ? [article.image_url] : undefined
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();
  const videoId = youtubeId(article.youtube_video_url);

  return (
    <main>
      <section className="relative min-h-[520px] overflow-hidden">
        <img
          src={article.image_url || "/max-reference-bg.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-max-black via-max-black/65 to-black/20" />
        <div className="relative mx-auto flex min-h-[520px] max-w-5xl flex-col justify-end px-4 pb-12 sm:px-6">
          <p className="text-sm uppercase tracking-[0.25em] text-max-cyan">{article.category}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-none tracking-tight md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 text-white/58">
            Publié le {formatDate(article.published_at || article.created_at)}
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {article.excerpt ? <p className="mb-8 text-xl leading-8 text-white/72">{article.excerpt}</p> : null}
        {videoId ? (
          <iframe
            className="mb-8 aspect-video w-full rounded-lg border border-white/10"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={article.title}
            allowFullScreen
          />
        ) : null}
        <div className="prose-news whitespace-pre-line">{article.content}</div>
      </article>
    </main>
  );
}
