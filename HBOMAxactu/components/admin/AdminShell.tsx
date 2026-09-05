import Link from "next/link";
import { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Clapperboard,
  FileText,
  Film,
  Building2,
  Folder,
  Globe,
  ImageIcon,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Newspaper,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Video
} from "lucide-react";
import { signOut } from "@/app/admin/actions";

const navGroups = [
  {
    title: "Contenu",
    links: [
      { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
      { label: "Articles", href: "/admin/articles", icon: FileText },
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Prochainement", href: "/admin/prochainement", icon: CalendarDays },
      { label: "Productions", href: "/admin/productions", icon: Film },
      { label: "Entreprises", href: "/admin/entreprises", icon: Building2 },
      { label: "Collections", href: "/admin/collections", icon: Folder },
      { label: "Calendrier", href: "/admin/calendrier", icon: CalendarDays }
    ]
  },
  {
    title: "Média",
    links: [
      { label: "Médiathèque", href: "/admin/mediatheque", icon: ImageIcon },
      { label: "Vidéos", href: "/admin/videos", icon: Video }
    ]
  },
  {
    title: "Engagement",
    links: [
      { label: "Commentaires", href: "/admin/commentaires", icon: MessageCircle },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { label: "Notifications", href: "/admin/notifications", icon: Bell }
    ]
  },
  {
    title: "SEO",
    links: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Redirections", href: "/admin/redirections", icon: TrendingUp },
      { label: "Sitemap", href: "/admin/sitemap", icon: Globe }
    ]
  },
  {
    title: "Paramètres",
    links: [
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
      { label: "Rôles & permissions", href: "/admin/roles-permissions", icon: ShieldCheck },
      { label: "Réglages", href: "/admin/reglages", icon: Settings },
      { label: "Générateur news", href: "/admin/generateur-news", icon: Clapperboard }
    ]
  }
];

export function AdminShell({
  children,
  title,
  subtitle,
  userLabel = "Admin"
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userLabel?: string;
}) {
  return (
    <main className="min-h-screen bg-[#050608] text-white">
      <div className="flex min-h-screen rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_55%_0%,rgba(255,255,255,.06),transparent_34rem),#050608]">
        <aside className="hidden w-[265px] shrink-0 border-r border-white/10 bg-black/35 px-5 py-7 lg:block">
          <Link href="/admin" className="block">
            <h1 className="text-2xl font-black tracking-tight">QuoiSurHBOMax</h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/55">Panel admin</p>
          </Link>

          <nav className="mt-9 space-y-7">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-white/45">{group.title}</p>
                <div className="space-y-1">
                  {group.links.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/66 hover:bg-white/[0.06] hover:text-white">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <form action={signOut} className="mt-10 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <User className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{userLabel}</p>
                <p className="text-xs text-white/50">Administrateur</p>
              </div>
            </div>
            <button className="mt-4 w-full rounded-md border border-white/10 px-3 py-2 text-sm text-white/65 hover:border-white/30">
              Déconnexion
            </button>
          </form>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-white/5 pb-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              {subtitle ? <p className="text-sm text-white/50">{subtitle}</p> : null}
              <h2 className="mt-1 text-3xl font-black tracking-tight">{title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/admin/articles/new" className="rounded-lg bg-max-blue px-4 py-3 text-sm font-black text-black">
                Créer
              </Link>
              <Link href="/" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold hover:bg-white/[0.1]">
                Voir le site
              </Link>
            </div>
          </header>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

export function AdminPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-white/10 bg-[#101318]/85 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] ${className}`}>
      {children}
    </section>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-black/20 p-8 text-center">
      <p className="text-lg font-black">{title}</p>
      <p className="mt-2 text-sm text-white/55">{text}</p>
    </div>
  );
}
