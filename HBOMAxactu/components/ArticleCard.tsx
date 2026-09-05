import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Article } from "@/lib/types";

export function ArticleCard({ article, large = false, index = 0 }: { article: Article; large?: boolean; index?: number }) {
  return (
    <article className="card-reveal group relative z-0 overflow-hidden rounded-[6px] border border-white/10 bg-white/[0.045] transition-all duration-300 ease-in-out hover:z-10 hover:scale-105 hover:border-white/25 hover:bg-white/[0.07] hover:shadow-[0_24px_70px_rgba(20,80,180,.32)]" style={{ animationDelay: `${index * 55}ms` }}>
      <Link href={`/actualites/${article.slug}`}>
        <div className={large ? "aspect-[16/9] overflow-hidden" : "aspect-[16/10] overflow-hidden"}>
          <img src={article.image_url || "/max-reference-bg.png"} alt="" className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
        </div>
        <div className="space-y-2 p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-max-cyan">
            <span>{article.category}</span>
            <span className="text-white/30">•</span>
            <time className="text-white/48">{formatDate(article.published_at || article.created_at)}</time>
          </div>
          <h3 className={large ? "text-xl font-black leading-tight" : "text-base font-bold leading-tight"}>{article.title}</h3>
          {article.excerpt ? <p className="line-clamp-3 text-xs leading-5 text-white/62">{article.excerpt}</p> : null}
        </div>
      </Link>
    </article>
  );
}
