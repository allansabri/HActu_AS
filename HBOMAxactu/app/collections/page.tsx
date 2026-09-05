import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { getCollections } from "@/lib/queries";

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await getCollections(60);

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6">
      <SectionHeading eyebrow="Collections" title="Univers thématiques" text="Collections créées dans l’admin : DC, Harry Potter, HBO Originals, nouveautés et séries cultes." />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((collection, index) => (
          <Link key={collection.id} href={`/collections#${collection.slug}`} style={{ animationDelay: `${index * 55}ms` }} className="card-reveal relative z-0 rounded-[6px] border border-white/10 bg-white/[0.045] p-4 transition-all duration-300 ease-in-out hover:z-10 hover:scale-105 hover:border-white/30 hover:shadow-[0_24px_70px_rgba(20,80,180,.3)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-max-cyan">Collection</p>
            <h2 className="mt-2 text-xl font-black">{collection.title}</h2>
            <p className="mt-2 text-xs leading-5 text-white/60">{collection.description || "Collection éditoriale administrable."}</p>
          </Link>
        ))}
      </div>
      {!collections.length ? <p className="text-white/60">Aucune collection publique pour le moment.</p> : null}
    </main>
  );
}
