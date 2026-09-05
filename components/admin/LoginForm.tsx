"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (loginError) {
      setError(loginError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-lg border border-white/10 bg-white/[0.045] p-6">
      <h1 className="text-3xl font-black">Connexion admin</h1>
      <label className="block text-sm text-white/70">
        Email
        <input name="email" type="email" required className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan" />
      </label>
      <label className="block text-sm text-white/70">
        Mot de passe
        <input name="password" type="password" required className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan" />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-md bg-max-blue px-4 py-3 font-bold text-black disabled:opacity-60">
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
