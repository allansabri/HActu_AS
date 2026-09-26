import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getSeriesReviewsConfig } from "@/lib/reviews-config";

export const revalidate = 60;

export default async function CritiqueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getSeriesReviewsConfig();
  const review = config.items.find((item) => item.slug === slug);

  if (!review) {
    return (
      <main className="min-h-screen bg-[#050a0a] text-white pt-24 pb-20">
        <div className="mx-auto w-full max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-black">Critique introuvable</h1>
          <p className="mt-4 text-neutral-400">Cette critique n&apos;est pas disponible pour le moment.</p>
          <div className="mt-8">
            <Link
              href="/critiques"
              className="inline-flex items-center gap-2 rounded-full bg-[#8197a9] px-6 py-2.5 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux critiques
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const ratingClamped = Math.max(0, Math.min(5, Math.round(review.rating || 0)));

  return (
    <main className="min-h-screen bg-[#050a0a] text-white pt-24 pb-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Link
          href="/critiques"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Toutes les critiques
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-max-cyan">
            Critique Série • {review.series_title}
          </span>
          <span className="text-neutral-500">•</span>
          <time className="text-xs text-neutral-400">
            {formatDate(review.published_at)}
          </time>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          {review.title}
        </h1>

        {/* Note et Auteur */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-800 border border-white/20">
              {review.author_avatar ? (
                <img
                  src={review.author_avatar}
                  alt={review.author_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-neutral-900 text-white font-bold">
                  {review.author_name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-neutral-400">Critique rédigée par</p>
              <p className="text-sm font-bold text-white">{review.author_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Note attribuée
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= ratingClamped
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_1px_1px_rgba(251,191,36,0.3)]"
                      : "text-neutral-600 fill-neutral-800"
                  }`}
                />
              ))}
            </div>
            <span className="text-base font-black text-amber-400">
              {ratingClamped}/5
            </span>
          </div>
        </div>

        {/* Image d'en-tête */}
        <div className="mt-8 relative aspect-[16/9] w-full overflow-hidden rounded-none border border-white/10 shadow-2xl">
          <img
            src={review.image_url}
            alt={review.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Contenu de la critique */}
        <div className="mt-8 prose prose-invert max-w-none text-neutral-300 leading-relaxed space-y-4">
          <p className="text-lg font-medium text-white/90">
            {review.excerpt || "Une analyse approfondie des thématiques, de la mise en scène et du jeu d'acteur."}
          </p>
          <p>
            Cette saison confirme toute l&apos;exigence artistique propre aux productions HBO. L&apos;écriture resserrée, le soin accordé à la photographie et la profondeur des personnages offrent une expérience télévisuelle de premier ordre.
          </p>
          <p>
            Entre tension permanente et moments d&apos;émotion suspendus, la série parvient à renouveler son propos tout en maintenant un suspense haletant à chaque épisode.
          </p>
        </div>
      </div>
    </main>
  );
}
