"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Globe } from "lucide-react";
import { useLanguage, POPULAR_LANGUAGES, MORE_LANGUAGES } from "./LanguageProvider";

export function SiteHeader() {
  const router = useRouter();
  const { currentLang, setLanguage } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isFranchiseOpen, setIsFranchiseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/productions?s=${encodeURIComponent(searchValue.trim())}`);
    } else {
      setIsSearchOpen(true);
      inputRef.current?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(to_right,#1c2a37_0%,#050a0a_25%,#050a0a_100%)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-2.5 sm:py-3">
        <div className="flex items-center gap-8 sm:gap-12 lg:gap-14">
          <Link href="/" className="shrink-0 flex items-center" aria-label="HBO Max Actu">
            <Image
              src="/hbo-max-actu.png"
              alt="HBO Max Actu"
              width={200}
              height={24}
              priority
              referrerPolicy="no-referrer"
              className="h-[19px] sm:h-[23px] lg:h-[25px] w-auto max-w-[160px] sm:max-w-[200px] lg:max-w-[220px] object-contain transition-transform duration-200 hover:scale-[1.02]"
            />
          </Link>

          {/* Navigation Catégories */}
          <nav className="flex items-center gap-5 sm:gap-7 lg:gap-9">
            {/* 1. Films */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown("films")}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setIsFranchiseOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "films" ? null : "films")}
                className="text-[15px] sm:text-[16px] font-bold tracking-wide text-[#9b9b9c] group-hover:text-[#778b9d] transition-colors duration-200 focus:outline-none cursor-pointer flex items-center py-1"
                aria-expanded={activeDropdown === "films"}
              >
                Films
              </button>

              <div
                className={`absolute left-0 top-full pt-1.5 transition-all duration-200 z-50 ${
                  activeDropdown === "films"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="relative overflow-visible min-w-[250px] sm:min-w-[280px] bg-[#0f0f0f] shadow-2xl shadow-black/90 py-2.5">
                  <div
                    className={`absolute top-0 left-0 h-[1.5px] bg-white transition-all duration-700 ease-out ${
                      activeDropdown === "films" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                  {/* Item Franchise avec sous-menu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setIsFranchiseOpen(true)}
                    onMouseLeave={() => setIsFranchiseOpen(false)}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setIsFranchiseOpen(true)}
                      onClick={() => setIsFranchiseOpen(!isFranchiseOpen)}
                      className="w-full flex items-center justify-between px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150 cursor-pointer text-left"
                    >
                      <span className={isFranchiseOpen ? "text-[#778b9d]" : ""}>Franchise</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 -rotate-90 text-[#a5abb2] ${
                          isFranchiseOpen ? "text-[#778b9d]" : ""
                        }`}
                      />
                    </button>

                    {/* Sous-menu Franchise qui s'ouvre à droite */}
                    <div
                      className={`absolute left-full top-0 pl-1.5 transition-all duration-200 z-50 ${
                        isFranchiseOpen
                          ? "opacity-100 visible translate-x-0 pointer-events-auto"
                          : "opacity-0 invisible -translate-x-1 pointer-events-none"
                      }`}
                    >
                      <div className="min-w-[210px] sm:min-w-[230px] bg-[#0f0f0f] border-l border-white/10 shadow-2xl shadow-black/90 py-2">
                        <Link
                          href="/films?franchise=dc"
                          className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                        >
                          DC
                        </Link>
                        <Link
                          href="/films?franchise=harry-potter"
                          className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                        >
                          Harry Potter
                        </Link>
                        <Link
                          href="/films?franchise=animation"
                          className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                        >
                          Animations...
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/actualites?cat=films"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Les dernières actualités
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Séries */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown("series")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "series" ? null : "series")}
                className="text-[15px] sm:text-[16px] font-bold tracking-wide text-[#9b9b9c] group-hover:text-[#778b9d] transition-colors duration-200 focus:outline-none cursor-pointer flex items-center py-1"
                aria-expanded={activeDropdown === "series"}
              >
                Séries
              </button>

              <div
                className={`absolute left-0 top-full pt-1.5 transition-all duration-200 z-50 ${
                  activeDropdown === "series"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="relative overflow-hidden min-w-[250px] sm:min-w-[280px] bg-[#0f0f0f] shadow-2xl shadow-black/90 py-2.5">
                  <div
                    className={`absolute top-0 left-0 h-[1.5px] bg-white transition-all duration-700 ease-out ${
                      activeDropdown === "series" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                  <Link
                    href="/series"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Toutes les séries
                  </Link>
                  <Link
                    href="/series?origine=hbo"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Productions originales HBO
                  </Link>
                  <Link
                    href="/series?origine=hbo-max"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Productions originales HBO Max
                  </Link>
                  <Link
                    href="/actualites?cat=series"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Les dernières actualités
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. HBO Max */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown("hbomax")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "hbomax" ? null : "hbomax")}
                className="text-[15px] sm:text-[16px] font-bold tracking-wide text-[#9b9b9c] group-hover:text-[#778b9d] transition-colors duration-200 focus:outline-none cursor-pointer flex items-center py-1"
                aria-expanded={activeDropdown === "hbomax"}
              >
                HBO Max
              </button>

              <div
                className={`absolute left-0 top-full pt-1.5 transition-all duration-200 z-50 ${
                  activeDropdown === "hbomax"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="relative overflow-hidden min-w-[250px] sm:min-w-[280px] bg-[#0f0f0f] shadow-2xl shadow-black/90 py-2.5">
                  <div
                    className={`absolute top-0 left-0 h-[1.5px] bg-white transition-all duration-700 ease-out ${
                      activeDropdown === "hbomax" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                  <Link
                    href="/actualites"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Les dernières actualités
                  </Link>
                  <Link
                    href="/actualites?cat=internationaux"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Programmes internationaux
                  </Link>
                  <Link
                    href="/actualites?cat=francaises"
                    className="block px-5 py-2 text-[14px] sm:text-[15px] font-normal text-[#a5abb2] hover:text-[#778b9d] transition-colors duration-150"
                  >
                    Productions originales françaises
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. Nouveautés & À venir (sans menu déroulant) */}
            <Link
              href="/nouveautes"
              className="text-[15px] sm:text-[16px] font-bold tracking-wide text-[#9b9b9c] hover:text-[#778b9d] transition-colors duration-200 py-1 whitespace-nowrap"
            >
              Nouveautés & À venir
            </Link>

            {/* 5. Productions (sans menu déroulant) */}
            <Link
              href="/productions"
              className="text-[15px] sm:text-[16px] font-bold tracking-wide text-[#9b9b9c] hover:text-[#778b9d] transition-colors duration-200 py-1"
            >
              Productions
            </Link>
          </nav>
        </div>

        {/* Actions à droite : Recherche + Sélecteur de langue */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Loupe de recherche interactive qui s'ouvre au survol en rectangle arrondi */}
          <div
            className="group relative flex items-center justify-end py-1"
            onMouseEnter={() => {
              setIsSearchOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            onMouseLeave={() => {
              if (!searchValue.trim()) {
                setIsSearchOpen(false);
                inputRef.current?.blur();
              }
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center transition-all duration-300 ease-out border rounded-md overflow-hidden ${
                isSearchOpen || searchValue.trim().length > 0
                  ? "w-56 sm:w-72 md:w-80 h-10 px-3 border-white/30 bg-[#0f1722] shadow-2xl shadow-black/80 ring-1 ring-white/10"
                  : "w-10 h-10 justify-center border-transparent bg-transparent hover:bg-white/[0.08] group-hover:w-56 sm:group-hover:w-72 md:group-hover:w-80 group-hover:px-3 group-hover:border-white/30 group-hover:bg-[#0f1722] group-hover:shadow-2xl group-hover:shadow-black/80 group-hover:ring-1 group-hover:ring-white/10 focus-within:w-56 sm:focus-within:w-72 md:focus-within:w-80 focus-within:px-3 focus-within:border-white/30 focus-within:bg-[#0f1722] focus-within:shadow-2xl focus-within:ring-1 focus-within:ring-white/10"
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (searchValue.trim()) {
                    handleSearchSubmit();
                  } else {
                    setIsSearchOpen(true);
                    inputRef.current?.focus();
                  }
                }}
                className="shrink-0 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Rechercher"
              >
                <Search className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
              </button>
              <input
                ref={inputRef}
                type="text"
                name="s"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => {
                  if (!searchValue.trim()) {
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="Rechercher série, film..."
                className={`bg-transparent text-[13px] sm:text-[14px] text-white outline-none placeholder:text-white/45 transition-all duration-300 ${
                  isSearchOpen || searchValue.trim().length > 0
                    ? "w-full ml-2.5 opacity-100"
                    : "w-0 p-0 opacity-0 pointer-events-none group-hover:w-full group-hover:ml-2.5 group-hover:opacity-100 group-hover:pointer-events-auto focus-within:w-full focus-within:ml-2.5 focus-within:opacity-100 focus-within:pointer-events-auto"
                }`}
              />
            </form>
          </div>

          {/* Capsule sélecteur de langue avec Méga-Menu déroulant */}
          <div
            className="relative group py-1"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-[#778b9d]/40 hover:border-[#778b9d] bg-transparent hover:bg-white/[0.04] text-[#a5abb2] hover:text-white transition-all duration-200 cursor-pointer focus:outline-none"
              aria-expanded={isLangOpen}
              aria-label="Sélectionner la langue"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a5abb2] group-hover:text-white transition-colors" />
              <span className="text-[12px] sm:text-[13px] font-bold tracking-wider text-white">
                {currentLang.code}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#a5abb2] transition-transform duration-200 ${
                  isLangOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Grand Mega-Menu déroulant identique à la capture de référence */}
            <div
              className={`absolute right-0 top-full pt-2 transition-all duration-200 z-50 ${
                isLangOpen
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
              }`}
            >
              <div className="relative overflow-hidden w-[96vw] max-w-[1140px] bg-[#050505] border-t border-white/10 shadow-2xl shadow-black/95 px-8 sm:px-12 pt-7 pb-9 rounded-none">
                {/* Ligne blanche animée sur toute la largeur supérieure */}
                <div
                  className={`absolute top-0 left-0 h-[1.5px] bg-white transition-all duration-700 ease-out ${
                    isLangOpen ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />

                {/* Section 1 : LANGUES POPULAIRES (5 colonnes aérées) */}
                <div className="text-[11px] font-bold tracking-wider text-[#778b9d] uppercase mb-4">
                  LANGUES POPULAIRES
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-3.5 gap-x-6 sm:gap-x-10 lg:gap-x-14 mb-8">
                  {POPULAR_LANGUAGES.map((lang) => {
                    const isSelected = currentLang.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                        }}
                        className={`text-left text-[13px] sm:text-[14px] tracking-wide transition-colors py-0.5 cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "text-[#778b9d] font-semibold"
                            : "text-[#a5abb2] hover:text-[#778b9d] font-medium"
                        }`}
                      >
                        {lang.name}
                      </button>
                    );
                  })}
                </div>

                {/* Séparateur horizontal discret */}
                <div className="h-[1px] bg-white/[0.08] my-6" />

                {/* Section 2 : AUTRES LANGUES (3 grandes colonnes sans défilement, exactement comme l'image) */}
                <div className="text-[11px] font-bold tracking-wider text-[#778b9d] uppercase mb-4">
                  AUTRES LANGUES
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-12 sm:gap-x-20 lg:gap-x-28">
                  {/* Colonne 1 */}
                  <div className="flex flex-col space-y-3">
                    {MORE_LANGUAGES.slice(0, 9).map((lang) => {
                      const isSelected = currentLang.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                          }}
                          className={`text-left text-[13px] sm:text-[14px] tracking-wide transition-colors py-0.5 cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? "text-[#778b9d] font-semibold"
                              : "text-[#a5abb2] hover:text-[#778b9d] font-medium"
                          }`}
                        >
                          {lang.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Colonne 2 */}
                  <div className="flex flex-col space-y-3">
                    {MORE_LANGUAGES.slice(9, 18).map((lang) => {
                      const isSelected = currentLang.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                          }}
                          className={`text-left text-[13px] sm:text-[14px] tracking-wide transition-colors py-0.5 cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? "text-[#778b9d] font-semibold"
                              : "text-[#a5abb2] hover:text-[#778b9d] font-medium"
                          }`}
                        >
                          {lang.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Colonne 3 */}
                  <div className="flex flex-col space-y-3">
                    {MORE_LANGUAGES.slice(18).map((lang) => {
                      const isSelected = currentLang.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                          }}
                          className={`text-left text-[13px] sm:text-[14px] tracking-wide transition-colors py-0.5 cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? "text-[#778b9d] font-semibold"
                              : "text-[#a5abb2] hover:text-[#778b9d] font-medium"
                          }`}
                        >
                          {lang.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
