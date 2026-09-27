"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletterAjax } from "@/app/actions";

export function HomeNewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setFeedbackMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", email);
      const res = await subscribeNewsletterAjax(formData);
      if (res.success) {
        setStatus("success");
        setFeedbackMessage(res.message);
        setEmail("");
      } else {
        setStatus("error");
        setFeedbackMessage(res.message);
      }
    });
  };

  return (
    <section
      id="newsletter-accueil"
      aria-label="Newsletter Max"
      className="relative w-full border-t border-white/10 bg-gradient-to-b from-[#060608] via-[#121316] to-[#202227] py-14 sm:py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8">
        {/* Titre principal centré en haut avec police bold et sous-titre */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Toute l&apos;actualité Max dans votre boîte mail
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Recevez nos alertes sorties, annonces officielles et bandes-annonces exclusives sans manquer aucun temps fort.
          </p>
        </div>

        {/* Bloc du formulaire avec le fond dégradé identique au rectangle gauche de la section Prochainement sur HBO Max */}
        <div
          className="mt-8 sm:mt-10 mx-auto max-w-2xl rounded-xl p-6 sm:p-8 shadow-2xl"
          style={{
            background:
              "linear-gradient(160deg, rgba(220, 226, 235, 0.14) 0%, rgba(44, 51, 63, 0.85) 25%, rgba(18, 22, 29, 0.95) 70%, rgba(9, 11, 15, 0.98) 100%)",
            border: "1px solid rgba(215, 222, 232, 0.22)",
          }}
        >
          <div className="text-center mb-5 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Abonnez-vous à notre sélection d&apos;actus
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-300">
              Un récapitulatif régulier des nouveautés et temps forts incontournables.
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center rounded-none border border-emerald-500/40 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-200">
                ✓ {feedbackMessage}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="text-xs text-neutral-300 hover:text-white underline transition-colors cursor-pointer"
                >
                  Inscrire une autre adresse e-mail
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full flex-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse e-mail"
                  className="w-full rounded-full border border-neutral-300 bg-[#f4f5f7] px-5 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 outline-none transition-all duration-200 focus:bg-white focus:border-white focus:ring-2 focus:ring-[#8197a9]/50 shadow-inner"
                />
              </div>

              {/* Bouton strictement identique au bouton Voir toutes les actualités */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99] shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Inscription..." : "S'abonner"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-center text-xs font-medium text-red-400">
              {feedbackMessage}
            </p>
          )}

          <p className="mt-4 text-center text-[11px] text-neutral-500">
            Gratuit et sans engagement. Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
}
