"use client";

import { useState, useEffect } from "react";
import { createClient as createBrowserSupabase } from "@/lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);
  const [diagResult, setDiagResult] = useState<string | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  async function handleDiag() {
    setDiagLoading(true);
    setDiagResult(null);
    try {
      const res = await fetch("/api/admin/diag");
      const json = await res.json();
      if (json.pingOk) {
        setDiagResult(
          `Connexion Supabase OK ! Base active. Projets: ${json.tables?.production_projects?.count ?? 0}, Top 10: ${json.tables?.top_10_france?.count ?? 0}, Articles: ${json.tables?.articles?.count ?? 0}`
        );
      } else {
        setDiagResult(`Erreur diagnostic: ${json.error || "Impossible de joindre Supabase"}`);
      }
    } catch (e: any) {
      setDiagResult(`Erreur: ${e?.message || "Erreur réseau"}`);
    } finally {
      setDiagLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("1/3 : Vérification de vos identifiants auprès de Supabase...");
    setUserId(null);

    try {
      // 1. Sign in via route handler to establish HTTP-only session cookies
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue lors de la connexion.");
        if (data.userId) {
          setUserId(data.userId);
        }
        setStatusMessage(null);
        setLoading(false);
        return;
      }

      setStatusMessage("2/3 : Synchronisation de la session locale...");

      // 2. Also authenticate browser client so client-side state / localStorage is active
      try {
        const browserSupabase = createBrowserSupabase();
        await browserSupabase.auth.signInWithPassword({ email, password });
      } catch (clientErr) {
        console.warn("Client auth sync notice:", clientErr);
      }

      setStatusMessage("3/3 : Authentification validée ! Redirection vers /admin...");

      // 3. Navigate to admin
      setTimeout(() => {
        window.location.replace("/admin");
      }, 400);
    } catch (err: any) {
      setError(err?.message || "Impossible de contacter le serveur d'authentification.");
      setStatusMessage(null);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {isInIframe ? (
        <div
          id="iframe-notice-banner"
          className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-xs text-amber-200"
        >
          <p className="font-bold text-amber-300 text-sm mb-1">
            Recommandé : Ouvrez en plein écran
          </p>
          <p className="text-white/80 mb-3 leading-relaxed">
            Les navigateurs récents bloquent les cookies de session dans les fenêtres intégrées (iframes). Si la page se recharge sans vous connecter, ouvrez l&apos;application dans son propre onglet :
          </p>
          <a
            id="open-full-tab-btn"
            href="/admin/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-amber-400 px-3.5 py-2 font-bold text-black transition hover:bg-amber-300"
          >
            Ouvrir la page de connexion en plein écran ↗
          </a>
        </div>
      ) : null}

      <form
        id="admin-login-form"
        onSubmit={handleSubmit}
        className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-xl space-y-4"
      >
        <h1 id="admin-login-title" className="text-3xl font-black text-white">
          Connexion admin
        </h1>
        <p className="text-xs text-white/60">
          Connectez-vous avec vos identifiants Supabase configurés avec le rôle administrateur.
        </p>

        <label className="block text-sm text-white/70">
          Email
          <input
            id="admin-login-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="votre-email@exemple.com"
            className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
          />
        </label>

        <label className="block text-sm text-white/70">
          Mot de passe
          <input
            id="admin-login-password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
          />
        </label>

        {statusMessage ? (
          <div
            id="admin-login-status"
            className="rounded-md border border-max-blue/30 bg-max-blue/10 p-3 text-xs text-max-cyan font-medium animate-pulse"
          >
            {statusMessage}
          </div>
        ) : null}

        {error ? (
          <div
            id="admin-login-error"
            className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200 space-y-2"
          >
            <p className="font-semibold text-red-300">{error}</p>
            {userId ? (
              <div className="rounded border border-amber-400/30 bg-black/60 p-3 text-xs text-amber-200">
                <p className="font-semibold text-white/90 mb-1.5">
                  Copiez et exécutez cette commande dans Supabase (SQL Editor) :
                </p>
                <pre className="overflow-x-auto select-all rounded bg-black/80 p-2 font-mono text-emerald-300">
                  {`insert into public.user_roles (user_id, role) values ('${userId}', 'admin') on conflict (user_id, role) do nothing;`}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          id="admin-login-submit"
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-md bg-max-blue px-4 py-3 font-bold text-black transition hover:bg-max-blue/90 disabled:opacity-60"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <div className="pt-2 flex items-center justify-between text-xs text-white/50 border-t border-white/10">
          <button
            id="admin-diag-btn"
            type="button"
            onClick={handleDiag}
            disabled={diagLoading}
            className="text-white/60 hover:text-white underline cursor-pointer"
          >
            {diagLoading ? "Test en cours..." : "Tester l'état de la base Supabase"}
          </button>

          <a
            id="admin-new-tab-link"
            href="/admin/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-max-cyan hover:underline"
          >
            Plein écran ↗
          </a>
        </div>

        {diagResult ? (
          <div
            id="admin-diag-result"
            className="rounded bg-black/50 p-2.5 text-xs text-emerald-300 border border-white/10 font-mono"
          >
            {diagResult}
          </div>
        ) : null}
      </form>
    </div>
  );
}
