import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Article } from "@/lib/types";

export function ArticleCard({ article, large = false, index = 0 }: { article: Article; large?: boolean; index?: number }) {
  return (
    <article 
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#0a0c14] transition-all hover:border-white/25" 
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={`/actualites/${article.slug}`} className="block">
        <div className={large ? "aspect-[16/9] overflow-hidden" : "aspect-[16/10] overflow-hidden bg-black/40"}>
          <img
            src={article.image_url || "/max-reference-bg.png"}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-x-2 text-[10px] font-bold uppercase tracking-[0.18em] text-max-cyan">
            <span>{article.category}</span>
            <span className="text-white/25">•</span>
            <time className="font-medium text-white/45">{formatDate(article.published_at || article.created_at)}</time>
          </div>
          <h3 className={large ? "mt-2.5 text-[21px] font-black leading-[1.15] tracking-[-0.01em]" : "mt-2 text-[15.5px] font-bold leading-tight tracking-[-0.005em]"}>
            {article.title}
          </h3>
          {article.excerpt ? (
            <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.35] text-white/65">{article.excerpt}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
