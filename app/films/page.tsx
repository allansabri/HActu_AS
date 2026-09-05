import Link from "next/link";
import { PosterCard } from "@/components/PosterCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getProductionsByType } from "@/lib/queries";

export const revalidate = 60;

export default async function FilmsPage() {
  const movies = await getProductionsByType("movie", 60);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <SectionHeading eyebrow="Catalogue" title="Films HBO &amp; Max" text="Tous les films disponibles ou à venir sur la plateforme." />
        <span className="hidden text-sm text-white/50 md:block">{movies.length} titres</span>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((project, index) => <PosterCard key={project.id} project={project} index={index} showStatus={false} />)}
      </div>
      {!movies.length ? <p className="text-white/60 mt-8">Aucun film enregistré.</p> : null}
      <div className="mt-9 text-center text-sm">
        <Link href="/productions" className="text-max-cyan hover:underline">Explorer toutes les productions →</Link>
      </div>
    </main>
  );
}
