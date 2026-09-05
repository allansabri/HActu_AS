import { PosterCard } from "@/components/PosterCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getProductionsByType } from "@/lib/queries";

export const revalidate = 60;

export default async function SeriesPage() {
  const series = await getProductionsByType("series", 60);

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6">
      <SectionHeading eyebrow="Catalogue" title="Séries HBO Max" text="Toutes les séries ajoutées depuis les fiches productions du back-office." />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {series.map((project, index) => <PosterCard key={project.id} project={project} index={index} />)}
      </div>
      {!series.length ? <p className="text-white/60">Aucune série enregistrée.</p> : null}
    </main>
  );
}
