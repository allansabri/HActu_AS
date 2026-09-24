import { AdminShell } from "@/components/admin/AdminShell";
import { TrailersBannerManager } from "@/components/admin/TrailersBannerManager";
import { requireAdmin } from "@/lib/auth";
import { getTrailersBannerConfig } from "@/lib/trailers-banner";

export const dynamic = "force-dynamic";

export default async function AdminBandesAnnoncesPage() {
  const user = await requireAdmin();
  const config = await getTrailersBannerConfig();

  return (
    <AdminShell
      title="Bandes-Annonces & Promotion"
      subtitle="Personnalisez la section des dernières bandes-annonces, le logo officiel, le pitch et les vidéos de la page d'accueil."
      userLabel={user.email?.split("@")[0] || "Admin"}
    >
      <TrailersBannerManager initialConfig={config} />
    </AdminShell>
  );
}
