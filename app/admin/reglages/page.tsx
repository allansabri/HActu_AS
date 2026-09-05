import { saveSiteSettings } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPanel, AdminShell } from "@/components/admin/AdminShell";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*");
  const settings = Object.fromEntries(((data || []) as Array<{ key: string; value: string }>).map((item) => [item.key, item.value]));

  return (
    <AdminShell title="Réglages" subtitle="Nom du site, logo, menus, footer, réseaux, SEO global, maintenance, newsletter et API." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminNotice searchParams={searchParams} />
      <AdminPanel className="p-5">
        <form action={saveSiteSettings} className="grid gap-5 lg:grid-cols-2">
          <InputField label="Nom du site" name="site_name" defaultValue={settings.site_name || "QuoiSurHBOMax"} />
          <InputField label="Logo URL" name="logo_url" defaultValue={settings.logo_url || "/logo.png"} />
          <TextAreaField label="Menus" name="main_menu" rows={4} defaultValue={settings.main_menu} placeholder="Accueil, Actualités, Top 10..." />
          <TextAreaField label="Footer" name="footer_text" rows={4} defaultValue={settings.footer_text} />
          <TextAreaField label="Réseaux sociaux" name="social_links" rows={4} defaultValue={settings.social_links} />
          <TextAreaField label="SEO global" name="global_seo_description" rows={4} defaultValue={settings.global_seo_description} />
          <InputField label="SEO title global" name="global_seo_title" defaultValue={settings.global_seo_title} />
          <InputField label="Maintenance" name="maintenance_mode" defaultValue={settings.maintenance_mode || "off"} />
          <InputField label="Expéditeur newsletter" name="newsletter_sender" defaultValue={settings.newsletter_sender} />
          <InputField label="Statut API TMDB" name="tmdb_api_status" defaultValue={settings.tmdb_api_status || "active"} />
          <div className="lg:col-span-2">
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">Enregistrer les réglages</button>
          </div>
        </form>
      </AdminPanel>
    </AdminShell>
  );
}
