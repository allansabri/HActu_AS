import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ShieldCheck, Check, Settings, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de cookies & vie privée | HBO Max Actu",
  description:
    "Découvrez comment HBO Max Actu utilise les cookies pour assurer le bon fonctionnement du site et respecter votre vie privée.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-white">
      {/* Fil d'ariane */}
      <div className="border-b border-white/[0.06] bg-black/30">
        <div className="mx-auto flex max-w-[1000px] items-center gap-2 px-4 py-3 text-xs text-neutral-400 sm:px-6">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-medium">Politique de confidentialité & cookies</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:py-16">
        {/* En-tête */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-[#8197a9] mb-4">
            <Cookie size={14} />
            <span>Gestion des traceurs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Politique de confidentialité & cookies
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Transparence sur l’utilisation des cookies et des technologies de stockage local sur HBO Max Actu.
          </p>
        </div>

        <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 : Qu'est-ce qu'un cookie ? */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9]">
                <Info size={18} />
              </span>
              <span>Qu’est-ce qu’un cookie ?</span>
            </h2>
            <div className="space-y-3">
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la consultation d’un site internet. Il permet au site de mémoriser vos préférences de navigation (comme le choix de la langue ou l’état de connexion) et d’assurer une navigation fluide et sécurisée.
              </p>
            </div>
          </section>

          {/* Section 2 : Les cookies utilisés sur notre site */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9]">
                <ShieldCheck size={18} />
              </span>
              <span>Les catégories de cookies sur HBO Max Actu</span>
            </h2>
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center gap-2 font-bold text-white text-base mb-1">
                  <Check size={16} className="text-emerald-400" />
                  <span>1. Cookies techniques indispensables (exemptés de consentement)</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Ces traceurs sont strictement nécessaires au fonctionnement technique du site : sécurisation de la session d’administration, affichage adapté à votre appareil et mémorisation de votre langue préférée. Sans eux, le site ne peut pas fonctionner normalement.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center gap-2 font-bold text-white text-base mb-1">
                  <Check size={16} className="text-emerald-400" />
                  <span>2. Cookies de médias embarqués (lecteurs de bandes-annonces)</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Certaines pages intègrent des bandes-annonces officielles (via YouTube). La lecture de ces vidéos peut déposer des traceurs gérés par la plateforme hôte afin d’adapter la résolution vidéo et mesurer les vues.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center gap-2 font-bold text-white text-base mb-1">
                  <Check size={16} className="text-emerald-400" />
                  <span>3. Pas de profilage publicitaire invasif</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Nous ne vendons pas vos habitudes de navigation et n’utilisons pas de régies publicitaires intrusives qui pistent votre comportement d’un site à l’autre.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 : Comment contrôler ou refuser les cookies */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9]">
                <Settings size={18} />
              </span>
              <span>Comment paramétrer vos cookies dans votre navigateur ?</span>
            </h2>
            <div className="space-y-3">
              <p>
                Vous pouvez à tout moment configurer votre logiciel de navigation afin d’accepter ou refuser le dépôt de cookies, de manière ponctuelle ou systématique :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-400 text-sm">
                <li><strong className="text-white">Google Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies tiers.</li>
                <li><strong className="text-white">Mozilla Firefox :</strong> Options &gt; Vie privée et sécurité &gt; Cookies et données de sites.</li>
                <li><strong className="text-white">Apple Safari :</strong> Réglages &gt; Safari &gt; Confidentialité et sécurité &gt; Bloquer tous les cookies.</li>
                <li><strong className="text-white">Microsoft Edge :</strong> Paramètres &gt; Autorisations de site &gt; Cookies et données stockées.</li>
              </ul>
              <p className="text-xs text-neutral-400 pt-2">
                Pour toute question complémentaire sur notre politique de gestion des cookies, contactez-nous à <span className="text-white font-mono">contact@hbomaxactu.fr</span>.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
