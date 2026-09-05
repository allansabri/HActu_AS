import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { titleHref } from "@/lib/links";
import { getTop10 } from "@/lib/queries";
import { ContentType } from "@/lib/types";

export const revalidate = 60;

function TopTable({ title, type, items }: { title: string; type: ContentType; items: Awaited<ReturnType<typeof getTop10>> }) {
  const rows = items.filter((item) => item.type === type);

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <h2 className="mb-3 text-xl font-black">{title}</h2>
      <div className="overflow-hidden rounded-lg border border-white/10">
        {rows.length ? (
          rows.map((item, index) => (
            <Link key={item.id} href={titleHref(item.type, item.title)} style={{ animationDelay: `${index * 45}ms` }} className="card-reveal group relative z-0 grid grid-cols-[54px_1fr] border-b border-white/10 transition-all duration-300 ease-in-out hover:z-10 hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_12px_35px_rgba(20,80,180,.22)] last:border-b-0">
              <div className="bg-white/[0.05] p-3 text-xl font-black text-white/35">#{item.rank}</div>
              <div className="flex items-center gap-3 p-2.5">
                {item.image_url ? <img src={item.image_url} alt="" className="h-10 w-8 rounded object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" /> : <div className="h-10 w-8 rounded bg-white/10" />}
                <p className="text-sm font-bold">{item.title}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="p-4 text-white/60">Aucune donnée saisie pour aujourd'hui.</p>
        )}
      </div>
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
        text="Les films et séries les plus suivis du jour, saisis depuis le module admin."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <TopTable title="Top 10 Séries" type="series" items={items} />
        <TopTable title="Top 10 Films" type="movie" items={items} />
      </div>
    </main>
  );
}
