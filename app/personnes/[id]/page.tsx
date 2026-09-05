import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { formatDate } from "@/lib/format";
import { titleHref } from "@/lib/links";
import { getTmdbPerson } from "@/lib/tmdb";

export const revalidate = 3600;

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isFinite(id)) notFound();

  const person = await getTmdbPerson(id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045]">
          {person.profileUrl ? <img src={person.profileUrl} alt="" className="aspect-[2/3] w-full object-cover" /> : <div className="aspect-[2/3] bg-white/10" />}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-max-cyan">{person.knownForDepartment || "Personnalité"}</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">{person.name}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/55">
            {person.birthday ? <span>Né(e) le {formatDate(person.birthday)}</span> : null}
            {person.deathday ? <span>Décès : {formatDate(person.deathday)}</span> : null}
            {person.placeOfBirth ? <span>{person.placeOfBirth}</span> : null}
          </div>
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-white/70">
            {person.biography || "Biographie non disponible en français sur TMDB."}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading title="Films et séries" text="Principaux crédits connus sur TMDB." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {person.credits.map((credit) => (
            <Link key={`${credit.type}-${credit.tmdbId}`} href={titleHref(credit.type, credit.title)} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] hover:border-max-cyan/60">
              {credit.posterUrl ? <img src={credit.posterUrl} alt="" className="aspect-[2/3] w-full object-cover" /> : <div className="aspect-[2/3] bg-white/10" />}
              <div className="p-3">
                <p className="text-xs uppercase text-max-cyan">{credit.type === "movie" ? "Film" : "Série"}</p>
                <h2 className="mt-1 line-clamp-3 font-bold leading-tight">{credit.title}</h2>
                <p className="mt-2 text-xs text-white/45">{credit.role || "Crédit"} {credit.releaseDate ? `• ${credit.releaseDate.slice(0, 4)}` : ""}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
