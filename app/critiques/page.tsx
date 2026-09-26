import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getSeriesReviewsConfig } from "@/lib/reviews-config";

export const revalidate = 60;

export default async function CritiquesPage() {
  const config = await getSeriesReviewsConfig();

  return (
    <main className="min-h-screen bg-[#050a0a] text-white pt-24 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="mb-8 border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {config.section_title || "Les critiques des séries"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
              Retrouvez nos avis détaillés, analyses d&apos;épisodes, notes et critiques exclusives des grandes séries HBO et HBO Max.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {config.items.map((item) => {
            const ratingClamped = Math.max(0, Math.min(5, Math.round(item.rating || 0)));
            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <Link href={`/critiques/${item.slug}`} className="flex flex-col flex-1">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 rounded-none">
                    <img
                      src={item.image_url || "/max-reference-bg.png"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1 p-4 bg-white rounded-none">
                    <div>
                      <time className="block text-xs font-normal text-neutral-500">
                        {formatDate(item.published_at)}
                      </time>
                      <h2 className="mt-2 text-sm font-extrabold uppercase leading-snug tracking-tight text-neutral-950 line-clamp-3 min-h-[3.6em] group-hover:text-[#7a8fa1] transition-colors">
                        {item.title}
                      </h2>
                      {item.excerpt && (
                        <p className="mt-2 text-xs text-neutral-600 line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-neutral-200 border border-neutral-300">
                          {item.author_avatar ? (
                            <img
                              src={item.author_avatar}
                              alt={item.author_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-neutral-900 text-white text-[10px] font-bold">
                              {item.author_name?.charAt(0) || "A"}
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-neutral-900 truncate">
                          {item.author_name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-600 uppercase text-[10px] tracking-wider">
                            Note
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= ratingClamped
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-neutral-300 fill-neutral-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="font-black text-neutral-950">
                          {ratingClamped}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
