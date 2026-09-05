import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {error === "role" ? (
        <p className="mx-auto mb-4 max-w-md rounded-md border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          Compte connecté, mais rôle admin manquant dans `user_roles`.
        </p>
      ) : null}
      <LoginForm />
    </main>
  );
}
