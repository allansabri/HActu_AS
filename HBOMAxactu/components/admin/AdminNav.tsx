import Link from "next/link";
import { signOut } from "@/app/admin/actions";

const links = [
  ["Tableau de bord", "/admin"],
  ["Articles", "/admin/articles"],
  ["News", "/admin/news"],
  ["Prochainement", "/admin/prochainement"],
  ["Productions", "/admin/productions"],
  ["Entreprises", "/admin/entreprises"],
  ["Collections", "/admin/collections"],
  ["Médiathèque", "/admin/mediatheque"],
  ["Newsletter", "/admin/newsletter"],
  ["Analytics", "/admin/analytics"],
  ["Réglages", "/admin/reglages"]
];

export function AdminNav() {
  return (
    <div className="mb-8 rounded-lg border border-white/10 bg-[#101318]/85 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm hover:border-max-cyan">
            {label}
          </Link>
        ))}
        <form action={signOut} className="ml-auto">
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65 hover:border-white/30">
            Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
