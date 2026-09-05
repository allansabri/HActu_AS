import Link from "next/link";

const columns = [
  {
    title: "Navigation",
    links: [
      ["Accueil", "/"],
      ["Nouveautés", "/nouveautes"],
      ["Top 10", "/top-10-france"],
      ["Actualités", "/actualites"],
      ["Prochainement", "/prochainement"]
    ]
  },
  {
    title: "Catalogues",
    links: [
      ["Séries", "/series"],
      ["Films", "/films"],
      ["Guides", "/guides"],
      ["Collections", "/collections"],
      ["Bandes-annonces", "/bandes-annonces"]
    ]
  },
  {
    title: "Informations",
    links: [
      ["Mentions légales", "/mentions-legales"],
      ["Confidentialité", "/confidentialite"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
      ["Admin", "/admin"]
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/[0.08] bg-[#04050a]/92">
      <div className="mx-auto grid max-w-[1500px] gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <h2 className="text-base font-bold text-white/80">Quoi sur HBO Max</h2>
          <p className="mt-2.5 max-w-md text-[11px] leading-5 text-white/42">
            Média éditorial indépendant dédié aux sorties HBO, Max et Warner Bros. Discovery en France.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-400">{column.title}</h3>
              <div className="mt-2.5 grid gap-2 text-[11px] text-white/42">
                {column.links.map(([label, href]) => (
                  <Link key={href} href={href} className="transition-colors duration-200 hover:text-white/75">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
