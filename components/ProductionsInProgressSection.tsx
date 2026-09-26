import Link from "next/link";
import { formatDate } from "@/lib/format";
import { productionHref } from "@/lib/links";
import { ProductionProject } from "@/lib/types";

function getProductionTag(project: ProductionProject): string {
  if (project.production_label) return project.production_label;
  if (project.type === "series") {
    return project.platform ? `${project.platform} - Séries` : "HBO Max - Séries";
  }
  return project.platform ? `${project.platform} - Films` : "HBO Max - Films";
}

function getProductionDisplayDate(project: ProductionProject): string {
  if (project.release_date_france) {
    return formatDate(project.release_date_france);
  }
  if (project.release_date_estimated) {
    return formatDate(project.release_date_estimated);
  }
  if (project.release_year) {
    return `Sortie estimée en ${project.release_year}`;
  }
  if (project.status) {
    return project.status;
  }
  return "Date à confirmer";
}

function ProductionCard({
  project,
  large = true,
  imageHeight,
  index = 0,
}: {
  project: ProductionProject;
  large?: boolean;
  imageHeight?: string;
  index?: number;
}) {
  const displayImage =
    project.banner_url ||
    project.image_url ||
    project.poster_url ||
    "/max-reference-bg.png";

  const displayDate = getProductionDisplayDate(project);
  const tag = getProductionTag(project);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 hover:shadow-xl w-full"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={productionHref(project.id)} className="flex flex-col flex-1">
        {/* 1. Image en haut - sans arrondi */}
        <div
          className={`relative ${
            imageHeight
              ? `${imageHeight} w-full`
              : large
              ? "aspect-[16/9] w-full"
              : "aspect-[16/10] sm:aspect-[16/9] w-full"
          } overflow-hidden bg-neutral-900 rounded-none`}
        >
          <img
            src={displayImage}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />

          {/* Badge statut si présent */}
          {project.status && (
            <div className="absolute top-0 left-0 z-10 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white border-b border-r border-white/15">
              {project.status}
            </div>
          )}
        </div>

        {/* 2. Rectangle inférieur : fond blanc avec textes sombres sans arrondi */}
        <div
          className={`flex flex-col justify-between flex-1 ${
            large ? "p-5 sm:p-6" : "p-4 sm:p-4.5"
          } bg-white rounded-none`}
        >
          <div>
            {/* Date ou statut en haut à gauche */}
            <div
              className={`block ${
                large ? "text-sm sm:text-[15px]" : "text-xs sm:text-[13px]"
              } font-normal tracking-normal text-neutral-600`}
            >
              {displayDate}
            </div>

            {/* Titre du projet en majuscules noir */}
            <h3
              className={`mt-3 ${
                large
                  ? "text-lg sm:text-[19px] lg:text-[20px] line-clamp-4 min-h-[5.2em]"
                  : "text-sm sm:text-base line-clamp-3 min-h-[4em]"
              } font-extrabold uppercase leading-[1.32] tracking-tight text-neutral-950`}
            >
              {project.title}
            </h3>
          </div>

          {/* Ligne inférieure : Catégorie / Origine à gauche, Bouton 'Découvrir le projet' à droite */}
          <div
            className={`${
              large ? "mt-8 pt-2" : "mt-5 pt-2"
            } flex items-center justify-between gap-2 border-t border-neutral-100`}
          >
            <span
              className={`${
                large ? "text-sm sm:text-[15px]" : "text-xs sm:text-[13px]"
              } font-bold text-neutral-800 tracking-tight truncate`}
            >
              {tag}
            </span>

            {/* Bouton agrandi, sans arrondi */}
            <span
              className={`inline-flex items-center justify-center rounded-none border border-neutral-900 bg-white ${
                large
                  ? "px-4 py-2 text-sm sm:text-[14px]"
                  : "px-3 py-1.5 text-xs sm:text-[13px]"
              } font-medium text-neutral-900 transition-colors duration-200 group-hover:bg-neutral-900 group-hover:text-white shrink-0 whitespace-nowrap`}
            >
              Découvrir le projet
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductionsInProgressSection({
  projects,
}: {
  projects: ProductionProject[];
}) {
  // Sélectionner 5 projets pour la colonne de gauche (2 grands en haut + 3 moyens en bas)
  const mainCards = projects.slice(0, 5);

  // Sélectionner jusqu'à 8 projets pour la liste latérale à droite
  const sidebarProjects = projects.slice(5, 13);

  return (
    <section
      id="section-productions-en-cours"
      aria-label="Productions en cours et en développement"
      className="w-full bg-gradient-to-b from-[#0e171f] to-[#050a0a] py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Titre de section identique à la section Les actualités de HBO et HBO Max */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Productions en cours et en développement
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8 xl:gap-10">
          {/* Colonne gauche : 2 grandes cartes en haut + 3 moins grandes en dessous */}
          <div className="w-full lg:w-[680px] xl:w-[700px] shrink-0 flex flex-col justify-between">
            {/* 2 grandes cartes côte à côte */}
            <div className="flex flex-col sm:flex-row gap-5">
              {mainCards.slice(0, 2).map((project, index) => (
                <div
                  key={project.id || index}
                  className="w-full sm:w-[330px] xl:w-[340px] shrink-0"
                >
                  <ProductionCard
                    project={project}
                    index={index}
                    large={true}
                    imageHeight="h-[225px] sm:h-[250px]"
                  />
                </div>
              ))}
            </div>

            {/* 3 cartes moins grandes en dessous */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4.5 mt-6">
              {mainCards.slice(2, 5).map((project, index) => (
                <ProductionCard
                  key={project.id || index + 2}
                  project={project}
                  index={index + 2}
                  large={false}
                />
              ))}
            </div>
          </div>

          {/* Colonne à droite : liste des productions en cours et en développement */}
          <div className="w-full lg:flex-1 min-w-0 flex flex-col mt-6 lg:mt-0">
            <div className="flex flex-col justify-between h-full gap-2 sm:gap-2.5">
              {sidebarProjects.map((project, index) => {
                const thumb =
                  project.image_url ||
                  project.poster_url ||
                  project.banner_url ||
                  "/max-reference-bg.png";
                const displayDate = getProductionDisplayDate(project);
                const tag = getProductionTag(project);

                return (
                  <Link
                    key={project.id || index}
                    href={productionHref(project.id)}
                    className="group flex items-center gap-3.5 p-1 sm:p-1.5 rounded-none transition-all duration-200 hover:bg-white/[0.04]"
                  >
                    {/* Card au format carré à gauche */}
                    <div className="relative aspect-square w-18 h-18 sm:w-20 sm:h-20 md:w-[78px] md:h-[78px] rounded-none overflow-hidden shrink-0 bg-neutral-900 border border-white/10 shadow-md group-hover:border-[#7a8fa1]/50 transition-colors">
                      <img
                        src={thumb}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Titre centré verticalement par rapport à la card */}
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <span className="text-[11px] sm:text-xs font-normal text-neutral-400">
                        {displayDate}
                      </span>
                      <h4 className="mt-0.5 text-xs sm:text-[13.5px] font-extrabold uppercase leading-snug tracking-tight text-white group-hover:text-[#7a8fa1] transition-colors line-clamp-2">
                        {project.title}
                      </h4>
                      <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-neutral-300">
                        {tag}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bouton en pilule qui atterrit sur la page productions */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/productions"
            className="inline-flex items-center justify-center rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
          >
            Voir toutes les productions
          </Link>
        </div>
      </div>
    </section>
  );
}
