import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck, Heart, Sparkles, MessageSquare, Send, CheckCircle2, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos & Contact | HBO Max Actu",
  description:
    "Découvrez l'histoire de HBO Max Actu, média d'actualité indépendant lancé en 2022 par des passionnés, et contactez notre rédaction.",
};

function TwitterXIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function AProposContactPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-white">
      {/* Fil d'ariane sobre */}
      <div className="border-b border-white/[0.06] bg-black/30">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-4 py-3 text-xs text-neutral-400 sm:px-6">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-medium">À propos & Contact</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-16">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-[#8197a9] mb-4">
            <Heart size={14} className="text-rose-400" />
            <span>Fondé par passion en avril 2022</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            À propos de HBO Max Actu
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Le média francophone d’actualité, d’analyses et de décryptage dédié à l’univers HBO, Max et Warner Bros. Discovery.
          </p>
        </div>

        {/* Section 1 : L'Histoire de HBO Max Actu (depuis avril 2022) */}
        <section className="mb-14 rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1 space-y-5 text-neutral-300 text-sm sm:text-base leading-relaxed">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#8197a9]">
                  <Sparkles size={20} />
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Notre histoire : 4 ans de passion partagée
                </h2>
              </div>

              <p>
                L’aventure <strong>HBO Max Actu</strong> a débuté en <strong>Avril 2022</strong> — voilà maintenant <strong>4 ans</strong> que nous suivons au quotidien l’évolution passionnante de la marque HBO et du groupe Warner Bros. Discovery en France et dans le monde francophone.
              </p>

              <p>
                Tout a commencé par pure passion cinématographique et sérielle. À l’époque, avant même le déploiement officiel de la plateforme en France, nous suivions de très près les programmes phares à travers le <strong>Pass Warner</strong>, pour informer notre communauté des dates de diffusion, des doublages français et des coulisses de tournage.
              </p>

              <p>
                Nous avons ensuite accompagné la mue de la plateforme devenue temporairement <strong>« Max »</strong>, avant le retour triomphal de la marque historique sous le label <strong>HBO Max</strong>. À travers chaque étape, notre boussole est restée inchangée : vous offrir l’information la plus rapide, claire et rigoureuse possible.
              </p>

              {/* Compte X avec 10,4k abonnés */}
              <div className="pt-2">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black border border-white/15 text-white shrink-0">
                      <TwitterXIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">HBO Max Actu</span>
                        <span className="text-xs text-neutral-400">@HBOMaxActuFR</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                        Communauté X : plus de <strong className="text-white font-semibold">10 400 abonnés (10,4k)</strong> au quotidien
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://x.com/HBOMaxActuFR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8197a9] hover:bg-[#a5abb2] text-neutral-950 font-bold px-5 py-2.5 text-xs sm:text-sm transition-all duration-200 shrink-0 shadow-md active:scale-95"
                  >
                    <TwitterXIcon className="h-4 w-4" />
                    <span>Rejoindre sur X</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 : Indépendant et non affilié */}
        <section className="mb-14 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#181510] to-[#0e0d0b] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
              <ShieldCheck size={22} />
            </span>
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Média indépendant & non affilié
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                <strong>HBO Max Actu</strong> est un site d’actualité et un média d’information indépendant, géré par des passionnés de pop-culture, de cinéma et de séries télévisées.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Nous tenons à préciser que ce site n’est <strong>en aucun cas sponsorisé, approuvé, affilié ou lié officiellement</strong> à la société <em>Warner Bros. Discovery</em>, <em>Home Box Office, Inc. (HBO)</em> ou au service de streaming <em>HBO Max</em>. Les marques citées, logos, affiches et visuels de films ou séries restent la propriété exclusive de leurs détenteurs légaux respectifs et sont mentionnés dans le cadre strict du droit de l’information et de la critique de presse.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 : Contactez-nous */}
        <section id="contact" className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-10 shadow-xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#8197a9] mb-4">
                <Mail size={22} />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Contactez la rédaction
              </h2>
              <p className="text-sm sm:text-base text-neutral-300">
                Une question, une remarque, un communiqué de presse ou une proposition de collaboration ? Écrivez-nous à notre adresse dédiée :
              </p>
              <div className="mt-4">
                <a
                  href="mailto:contact@hbomaxactu.fr"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/60 px-5 py-3 text-base sm:text-lg font-mono font-bold text-white hover:text-[#8197a9] hover:border-[#8197a9]/40 transition-colors"
                >
                  <Mail size={18} className="text-[#8197a9]" />
                  <span>contact@hbomaxactu.fr</span>
                </a>
              </div>
            </div>

            {/* Formulaire de contact fonctionnel */}
            <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#8197a9]" />
                <span>Formulaire de message direct</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                Remplissez les informations ci-dessous. Nous répondons généralement sous 24 à 48 heures.
              </p>

              <form
                action={`mailto:contact@hbomaxactu.fr`}
                method="GET"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Votre nom ou pseudo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Ex : Maxime"
                      className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#8197a9] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Votre adresse e-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="nom@exemple.com"
                      className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#8197a9] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Sujet de votre message
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Ex : Information sur une série, proposition, question..."
                    className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#8197a9] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Votre message
                  </label>
                  <textarea
                    name="body"
                    rows={5}
                    required
                    placeholder="Détaillez votre message ici..."
                    className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#8197a9] focus:outline-none transition-colors resize-y"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-neutral-400">
                    En soumettant ce formulaire, votre client mail s’ouvrira avec l’adresse <span className="text-neutral-200">contact@hbomaxactu.fr</span> préremplie.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#8197a9] hover:bg-[#a5abb2] text-neutral-950 font-bold px-6 py-2.5 text-sm transition-all duration-200 shrink-0 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Envoyer le message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
