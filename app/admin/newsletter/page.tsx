import { createNewsletterCampaign } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { NewsletterSubscriber } from "@/lib/types";

export default async function AdminNewsletterPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const [{ data: subscribersData, error: subscribersError }, { data: campaignsData, error: campaignsError }] = await Promise.all([
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
    supabase.from("newsletter_campaigns").select("*").order("created_at", { ascending: false })
  ]);
  const subscribers = (subscribersData || []) as NewsletterSubscriber[];
  const campaigns = (campaignsData || []) as Array<{ id: string; subject: string; status: string; created_at: string }>;

  return (
    <AdminShell title="Newsletter" subtitle="Abonnés, campagnes, aperçu, test et statistiques." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminNotice searchParams={searchParams} />
      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Nouvelle campagne</h3>
          <form action={createNewsletterCampaign} className="space-y-4">
            <InputField label="Objet du mail" name="subject" required />
            <TextAreaField label="Contenu" name="content" rows={10} required />
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">Enregistrer le brouillon</button>
            <p className="text-xs text-white/45">Aperçu, envoi test et envoi réel : fonctionnalité à venir.</p>
          </form>
        </AdminPanel>
        <div className="space-y-6">
          <AdminPanel className="p-5">
            <h3 className="mb-4 font-black">Abonnés</h3>
            {subscribersError ? <EmptyState title="Pas encore de données" text="La table newsletter_subscribers n'existe pas encore." /> : null}
            {!subscribersError && subscribers.length ? subscribers.map((subscriber) => (
              <p key={subscriber.id} className="rounded-md border border-white/10 p-3 text-sm">{subscriber.email} • {subscriber.status}</p>
            )) : null}
            {!subscribersError && !subscribers.length ? <EmptyState title="Aucun abonné" text="La liste s'affichera dès que des abonnés réels seront enregistrés." /> : null}
          </AdminPanel>
          <AdminPanel className="p-5">
            <h3 className="mb-4 font-black">Campagnes</h3>
            {campaignsError ? <EmptyState title="Fonctionnalité à configurer" text="La table newsletter_campaigns n'existe pas encore. Applique supabase-admin-upgrade.sql." /> : null}
            {!campaignsError && campaigns.length ? campaigns.map((campaign) => (
              <p key={campaign.id} className="rounded-md border border-white/10 p-3 text-sm">{campaign.subject} • {campaign.status}</p>
            )) : null}
            {!campaignsError && !campaigns.length ? <EmptyState title="Aucune campagne" text="Crée une campagne pour préparer la newsletter." /> : null}
          </AdminPanel>
        </div>
      </div>
    </AdminShell>
  );
}
