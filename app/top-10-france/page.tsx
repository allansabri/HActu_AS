import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { titleHref } from "@/lib/links";
import { getTop10 } from "@/lib/queries";
import { ContentType, Top10Item } from "@/lib/types";

export const revalidate = 60;

function Top10List({ title, type, items }: { title: string; type: ContentType; items: Top10Item[] }) {
  const rows = items
    .filter((item) => item.type === type)
    .sort((a, b) => a.rank - b.rank);

  return (
    <section className="rounded-[10px] border border-white/10 bg-white/[0.04] overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {rows.length ? (
        <div className="divide-y divide-white/10">
          {rows.map((item, index) => (
            <Link
              key={item.id}
              href={titleHref(item.type, item.title)}
              className="group flex items-center gap-4 px-4 py-3 transition hover:bg-white/[0.035] md:px-5"
            >
              <div className="w-11 text-right">
                <span className="text-3xl font-black text-white/30 group-hover:text-max-cyan">#{item.rank}</span>
              </div>
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  className="h-14 w-10 rounded object-cover shadow-sm transition group-hover:scale-105"
                />
              ) : (
                <div className="h-14 w-10 rounded bg-white/10" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold leading-tight group-hover:text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-white/45">Position {item.rank} • Mis à jour aujourd’hui</p>
              </div>
              <span className="ml-auto text-xs font-bold text-max-cyan opacity-70 transition group-hover:opacity-100">Voir →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-5 text-white/60">Aucune donnée pour ce classement.</div>
      )}
    </section>
  );
}

export default async function Top10FrancePage() {
  const items = await getTop10();

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-7 sm:px-6">
      <SectionHeading
        eyebrow="Classement quotidien"
        title="Top 10 France sur Max"
        text="Les films et séries les plus populaires du jour, mis à jour via l’admin."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Top10List title="Top 10 Séries" type="series" items={items} />
        <Top10List title="Top 10 Films" type="movie" items={items} />
      </div>

      <p className="mt-6 text-center text-xs text-white/40">
        Classement éditorial mis à jour manuellement dans l’espace admin.
      </p>
    </main>
  );
}
