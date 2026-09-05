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
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05060b]/58 shadow-[0_12px_32px_rgba(0,0,0,.18)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-2 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Quoi sur HBO Max">
          <Image src="/logo.png" alt="Quoi sur HBO Max" width={240} height={52} priority className="h-8 w-auto sm:h-9" />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-4 text-[12px] font-medium tracking-[0.01em] text-white/65 xl:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition-colors duration-200 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <form action="/actualites" className="ml-auto hidden min-w-60 items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[13px] text-white/70 md:flex">
          <Search size={16} />
          <input name="q" placeholder="Rechercher une série, un film, une news" className="w-full bg-transparent text-white outline-none placeholder:text-white/40" />
        </form>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-2 text-[12px] font-medium text-white/65 xl:hidden">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className="shrink-0 transition-colors duration-200 hover:text-white">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
