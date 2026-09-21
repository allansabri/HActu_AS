import { AdminShell } from "@/components/admin/AdminShell";
import { UpcomingSeriesBannerManager } from "@/components/admin/UpcomingSeriesBannerManager";
import { requireAdmin } from "@/lib/auth";
import { getUpcomingSeriesBanner } from "@/lib/upcoming-banner";

export const dynamic = "force-dynamic";

export default async function AdminSeriesAVenirPage() {
  const user = await requireAdmin();
  const bannerConfig = await getUpcomingSeriesBanner();

  return (
    <AdminShell
      title="Bandeau Séries 2026/2027"
      subtitle="Personnalisez le grand bandeau de l'accueil, le titre en gras et les cartes de séries à venir avec leur effet lumineux."
      userLabel={user.email?.split("@")[0] || "Admin"}
    >
      <UpcomingSeriesBannerManager initialConfig={bannerConfig} />
    </AdminShell>
  );
}
