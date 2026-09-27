import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Users,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Politique éditoriale et de corrections | HBO Max Actu",
  description:
    "Découvrez notre charte éditoriale, notre engagement envers l'exactitude, notre transparence sur l'usage de l'IA et notre procédure de correction.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-white">
      {/* Fil d'ariane */}
      <div className="border-b border-white/[0.06] bg-black/30">
        <div className="mx-auto flex max-w-[1000px] items-center gap-2 px-4 py-3 text-xs text-neutral-400 sm:px-6">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-medium">Politique éditoriale et de corrections</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:py-16">
        {/* En-tête */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-[#8197a9] mb-4">
            <FileText size={14} />
            <span>Charte de transparence & rigueur</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Politique éditoriale et procédure de correction
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Parce que votre confiance est primordiale, nous partageons en toute transparence nos méthodes de travail, nos principes d’écriture et nos engagements en matière de vérification de l’information.
          </p>
        </div>

        {/* Contenu structuré */}
        <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
          {/* 1. Déclaration de mission */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">1</span>
              <span>Déclaration de mission</span>
            </h2>
            <div className="space-y-3">
              <p>
                Chez <strong>HBO Max Actu</strong>, notre priorité absolue est d’offrir à nos lecteurs des actualités fiables, précises et captivantes autour des films, séries et productions de Warner Bros. Discovery et HBO.
              </p>
              <p>
                Lancé au départ sur les réseaux sociaux en avril 2022 par des passionnés, nous avons bâti au fil des années une communauté engagée de plus de 10 400 abonnés. Nous croyons profondément en la transparence, l’honnêteté intellectuelle et la responsabilité éditoriale.
              </p>
              <p>
                L’erreur étant humaine, nous considérons que la rigueur d’un média se mesure avant tout à sa capacité à reconnaître et rectifier immédiatement toute imprécision.
              </p>
            </div>
          </section>

          {/* 2. Transparence sur l'usage de l'Intelligence Artificielle (IA) */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">2</span>
              <span>Transparence sur l’utilisation de l’IA dans nos articles</span>
            </h2>
            <div className="space-y-3">
              <p>
                Je tiens à être <strong>totalement transparent et honnête avec vous</strong> : oui, j’utilise des outils d’intelligence artificielle pour m’épauler dans la rédaction et le traitement des articles de HBO Max Actu.
              </p>
              <p>
                Dans un univers audiovisuel où les annonces tombent à toute heure (souvent tard le soir en provenance des États-Unis), l’IA me sert d’assistant pour :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-300">
                <li>Traduire et synthétiser rapidement des communiqués de presse américains ou des interviews exclusives.</li>
                <li>Aider à la mise en page, à la structuration des paragraphes et au formatage des fiches techniques.</li>
                <li>Accélérer la mise en ligne pour que vous ayez l’information sans attendre plusieurs heures.</li>
              </ul>
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                <p className="font-semibold text-emerald-300 text-sm flex items-center gap-2 mb-1">
                  <CheckCircle2 size={16} />
                  <span>Validation et relecture 100 % humaine</span>
                </p>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Aucun article n’est publié sans avoir été <strong>intégralement relu, corrigé, enrichi et validé</strong> par un rédacteur humain. Nous vérifions systématiquement chaque date de sortie, chaque membre du casting, chaque bande-annonce et chaque source auprès de Warner Bros., HBO ou des médias de référence (Variety, Deadline, The Hollywood Reporter).
                </p>
              </div>
            </div>
          </section>

          {/* 3. Plagiat & Respect des sources */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">3</span>
              <span>Tolérance zéro pour le plagiat & respect des sources</span>
            </h2>
            <div className="space-y-3">
              <p>
                Le respect du travail des confrères et des créateurs est une valeur non négociable. Nous appliquons une tolérance zéro stricte envers le plagiat.
              </p>
              <p>
                Chaque exclusivité, citation d’interview ou révélation fait l’objet d’une attribution explicite du média ou du journaliste à l’origine du scoop, avec mention de son nom et lien direct vers l’article source.
              </p>
            </div>
          </section>

          {/* 4. Signaler une erreur */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">4</span>
              <span>Signaler une erreur ou une coquille</span>
            </h2>
            <div className="space-y-3">
              <p>
                Nous encourageons vivement nos lecteurs à nous faire part de toute erreur factuelle, date inexacte ou faute d’orthographe.
              </p>
              <p>
                Pour nous alerter, vous pouvez nous écrire directement par courriel à :
              </p>
              <div className="py-2">
                <a
                  href="mailto:contact@hbomaxactu.fr?subject=Signalement%20erreur%20article"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 font-mono text-sm sm:text-base font-bold text-white hover:text-[#8197a9] transition-colors"
                >
                  <Mail size={16} className="text-[#8197a9]" />
                  <span>contact@hbomaxactu.fr</span>
                </a>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Pensez à préciser dans votre message l’URL de l’article concerné ainsi que tout détail utile pour vérifier et appliquer la correction au plus vite.
              </p>
            </div>
          </section>

          {/* 5. Processus d'examen et procédure de correction */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">5</span>
              <span>Procédure de correction & mentions de mise à jour</span>
            </h2>
            <div className="space-y-3">
              <p>
                Dès qu’un signalement nous parvient ou qu’une évolution est confirmée par le diffuseur :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-300">
                <li>L’article est révisé sans délai afin d’intégrer l’information exacte.</li>
                <li>Si la rectification est majeure (changement de date de sortie, rectification de casting, annonce démentie), une mention <em>« Mise à jour du [date] : [explication succincte de la correction] »</em> est ajoutée de façon visible dans l’article.</li>
                <li>Pour les corrections mineures (faute de frappe, coquille typographique), la correction est appliquée directement pour assurer un confort de lecture optimal.</li>
              </ul>
            </div>
          </section>

          {/* 6. Rétractations */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">6</span>
              <span>Rétractations</span>
            </h2>
            <div className="space-y-3">
              <p>
                Dans le cas exceptionnel où une information relayée (par exemple une rumeur persistante) s’avérerait totalement démentie de source officielle ou trompeuse, un rectificatif clair sera publié et l’article sera soit actualisé en conséquence, soit retiré avec une notification explicative sur nos réseaux sociaux.
              </p>
            </div>
          </section>

          {/* 7. Signatures des auteurs */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141a] to-[#0c0e12] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#8197a9] text-sm">7</span>
              <span>Signatures des auteurs et fiches profils</span>
            </h2>
            <div className="space-y-3">
              <p>
                Chaque article publié sur le site comporte la signature de son rédacteur, sa photo et un lien direct vers son profil complet répertoriant sa biographie, ses réseaux sociaux et l’ensemble de ses publications.
              </p>
              <div className="pt-2">
                <Link
                  href="/auteurs"
                  className="inline-flex items-center gap-2 rounded-full bg-[#8197a9] hover:bg-[#a5abb2] text-neutral-950 font-bold px-5 py-2.5 text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-md"
                >
                  <Users size={15} />
                  <span>Consulter la liste de nos auteurs</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
