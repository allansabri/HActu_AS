import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; uid?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const uid = params.uid;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {!isSupabaseConfigured ? (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="font-bold text-amber-300 mb-1">Attention : Clés Supabase non configurées</p>
          <p className="text-xs leading-relaxed text-white/80">
            L&apos;application n&apos;a pas encore accès à votre base Supabase.
          </p>
        </div>
      ) : null}

      {error === "role" ? (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="font-bold text-amber-300 mb-1">Authentifié, mais rôle administrateur manquant</p>
          <p className="text-xs text-white/80 mb-2">
            Votre compte existe bien dans Supabase, mais il n&apos;a pas encore le rôle <strong>admin</strong> dans la table <code>user_roles</code>.
          </p>
          {uid ? (
            <div className="rounded bg-black/60 p-2.5 text-xs text-emerald-300">
              <p className="text-white/70 mb-1">Exécutez cette commande dans Supabase SQL Editor :</p>
              <pre className="overflow-x-auto select-all font-mono">
                {`insert into public.user_roles (user_id, role) values ('${uid}', 'admin') on conflict (user_id, role) do nothing;`}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}

      {error === "no_session" ? (
        <div className="mx-auto mb-6 max-w-md rounded-lg border border-blue-400/40 bg-blue-500/10 p-4 text-sm text-blue-100">
          <p className="font-bold text-blue-300 mb-1">Session expirée ou bloquée par l&apos;iframe</p>
          <p className="text-xs text-white/80">
            Votre navigateur peut bloquer les cookies tiers dans l&apos;aperçu. Si la connexion boucle, cliquez sur <strong>« Ouvrir la page dans un nouvel onglet ↗ »</strong> ci-dessous.
          </p>
        </div>
      ) : null}

      <LoginForm />
    </main>
  );
}
