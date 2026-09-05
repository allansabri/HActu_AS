import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const nav = [
  ["Accueil", "/"],
  ["Nouveautés", "/nouveautes"],
  ["Top 10", "/top-10-france"],
  ["Actualités", "/actualites"],
  ["Guides", "/guides"],
  ["Séries", "/series"],
  ["Films", "/films"],
  ["Productions", "/productions"],
  ["Prochainement", "/prochainement"],
  ["Collections", "/collections"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-[9px] sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Quoi sur HBO Max">
          <Image src="/logo.png" alt="Quoi sur HBO Max" width={240} height={52} priority className="h-[29px] w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-x-5 text-[12.5px] font-medium tracking-[0.005em] text-white/60 xl:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>

        <form action="/productions" className="ml-auto hidden min-w-[230px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-[7px] text-[13px] text-white/70 md:flex">
          <Search size={15} className="opacity-70" />
          <input name="s" placeholder="Rechercher série, film..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40" />
        </form>
      </div>

      <nav className="flex gap-x-4 overflow-x-auto border-t border-white/5 px-4 py-1.5 text-[12px] font-medium text-white/60 xl:hidden bg-[#05060a]">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className="shrink-0 transition hover:text-white">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
