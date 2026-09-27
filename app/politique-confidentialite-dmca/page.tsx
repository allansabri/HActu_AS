import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ShieldAlert, Lock, Mail, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité & DMCA | HBO Max Actu",
  description:
    "Consultez notre politique de confidentialité, la protection des données personnelles et la procédure de signalement DMCA / droits d'auteur.",
};

export default function ConfidentialiteDmcaPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-white">
      {/* Fil d'ariane */}
      <div className="border-b border-white/[0.06] bg-black/30">
        <div className="mx-auto flex max-w-[1000px] items-center gap-2 px-4 py-3 text-xs text-neutral-400 sm:px-6">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-medium">Politique de confidentialité & DMCA</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:py-16">
        {/* En-tête */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-[#8197a9] mb-4">
            <Scale size={14} />
            <span>Droits d&apos;auteur & Vie privée</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Politique de confidentialité & DMCA
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Consultez nos engagements relatifs au respect de la propriété intellectuelle, à la procédure de retrait de contenu DMCA et à la protection de vos données personnelles.
          </p>
        </div>

        <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 : Propriété intellectuelle & DMCA */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9]">
                <ShieldAlert size={18} />
              </span>
              <span>1. Droits d’auteur et procédure DMCA</span>
            </h2>
            <div className="space-y-4">
              <p>
                <strong>HBO Max Actu</strong> respecte scrupuleusement la propriété intellectuelle des créateurs, studios et producteurs.
              </p>
              <p>
                Toutes les marques commerciales, logos, affiches, photographies promotionnelles et extraits de bandes-annonces mentionnés ou affichés sur ce site sont la propriété exclusive de leurs détenteurs respectifs (notamment <em>Warner Bros. Discovery, Home Box Office, Inc., DC Studios</em> et leurs filiales).
              </p>
              <p>
                Ces éléments sont utilisés à des fins purement informatives, de critique cinématographique, de reportage d’actualité et d’illustration, en conformité avec les dispositions du Code de la propriété intellectuelle relatives à l’exception de courte citation ainsi qu’avec les principes du <em>Fair Use</em>.
              </p>

              {/* Procédure de retrait */}
              <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-[#8197a9]" />
                  <span>Procédure de demande de retrait (Notice and Take Down)</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mb-3">
                  Si vous êtes titulaire de droits d’auteur ou représentant d’un ayant droit et estimez qu’un contenu hébergé sur notre site porte atteinte à vos droits, vous pouvez nous adresser une notification par courriel à :
                </p>
                <div className="mb-3">
                  <a
                    href="mailto:contact@hbomaxactu.fr?subject=Demande%20de%20retrait%20DMCA"
                    className="inline-flex items-center gap-2 font-mono font-bold text-[#8197a9] hover:underline"
                  >
                    contact@hbomaxactu.fr
                  </a>
                </div>
                <p className="text-xs text-neutral-400">
                  Veuillez préciser dans votre notification : l’URL du contenu contesté, une justification de votre qualité d’ayant droit et les coordonnées permettant de vous contacter. Nous nous engageons à traiter toute réclamation légitime et à retirer le contenu concerné dans un délai de 24 à 48 heures ouvrées.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 : Politique de confidentialité (RGPD) */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9]">
                <Lock size={18} />
              </span>
              <span>2. Données personnelles et confidentialité</span>
            </h2>
            <div className="space-y-4">
              <p>
                Nous attachons une importance fondamentale à la confidentialité de vos données personnelles.
              </p>

              <div>
                <h3 className="font-bold text-white text-base mb-1">Données collectées</h3>
                <p className="text-neutral-300">
                  Nous ne collectons que les données strictement nécessaires au bon fonctionnement de nos services :
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-neutral-400 text-sm mt-1">
                  <li>Votre adresse e-mail lorsque vous vous inscrivez à notre newsletter.</li>
                  <li>Votre adresse e-mail et votre nom lorsque vous nous envoyez un message via le formulaire de contact.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-1">Absence de revente de données</h3>
                <p className="text-neutral-300">
                  <strong>Aucune donnée personnelle n’est vendue, louée, échangée ou cédée à des tiers</strong> à des fins commerciales ou publicitaires.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-1">Vos droits d’accès et de suppression</h3>
                <p className="text-neutral-300">
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification et d’effacement complet de vos données. Vous pouvez à tout moment vous désabonner de la newsletter via le lien de désinscription ou en nous écrivant à <span className="text-white font-mono">contact@hbomaxactu.fr</span>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
