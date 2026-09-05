export function AdminNotice({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const ok = typeof searchParams?.ok === "string" ? searchParams.ok : null;
  const error = typeof searchParams?.error === "string" ? searchParams.error : null;
  if (!ok && !error) return null;

  return (
    <div className={`mb-5 rounded-md border px-4 py-3 text-sm ${error ? "border-red-300/30 bg-red-500/10 text-red-100" : "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"}`}>
      {error || ok}
    </div>
  );
}
