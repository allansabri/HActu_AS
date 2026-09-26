import { saveMoreNewsSectionConfigAction, saveNewAndUpcomingSectionConfigAction, saveSportsSectionConfigAction, saveUpcomingEpisodesSectionConfigAction, saveSiteSettings } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPanel, AdminShell } from "@/components/admin/AdminShell";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { getMoreNewsConfig } from "@/lib/more-news-config";
import { getNewAndUpcomingConfig } from "@/lib/new-and-upcoming-config";
import { getSportsSectionConfig } from "@/lib/sports-config";
import { getUpcomingEpisodesConfig } from "@/lib/upcoming-episodes-config";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireAdmin();
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const [{ data }, moreNewsConfig, newAndUpcomingConfig, sportsConfig, upcomingEpisodesConfig] = await Promise.all([
    supabase.from("site_settings").select("*"),
    getMoreNewsConfig(),
    getNewAndUpcomingConfig(),
    getSportsSectionConfig(),
    getUpcomingEpisodesConfig(),
  ]);
  const settings = Object.fromEntries(((data || []) as Array<{ key: string; value: string }>).map((item) => [item.key, item.value]));

  return (
    <AdminShell title="Réglages" subtitle="Nom du site, logo, menus, footer, réseaux, SEO global, maintenance, newsletter et API." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminNotice searchParams={resolvedSearchParams} />
      
      {/* Configuration de la section « Nouveauté & À venir sur HBO Max » */}
      <AdminPanel className="p-5 mb-6 border-blue-500/30">
        <h3 className="text-lg font-black text-white">Section Accueil : « Nouveautés & À venir sur HBO Max »</h3>
        <p className="mt-1 text-xs text-white/60">
          Personnalisez le titre, sous-titre, bouton d&apos;action blanc et les 3 grands rectangles de filtres (chiffres et libellés de la semaine et du mois).
        </p>
        <form action={saveNewAndUpcomingSectionConfigAction} className="mt-5 grid gap-5 lg:grid-cols-2">
          <InputField label="Titre de la section" name="section_title" defaultValue={newAndUpcomingConfig.section_title} required />
          <InputField label="Texte du bouton blanc" name="button_text" defaultValue={newAndUpcomingConfig.button_text} required />
          <InputField label="Lien du bouton blanc" name="button_link" defaultValue={newAndUpcomingConfig.button_link} required />
          <div className="lg:col-span-2">
            <TextAreaField label="Sous-titre de la section" name="section_subtitle" rows={2} defaultValue={newAndUpcomingConfig.section_subtitle} required />
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-max-cyan">Rectangle 1 (Semaine)</h4>
            <InputField label="Nombre de nouveautés de la semaine" name="week_count" type="number" defaultValue={String(newAndUpcomingConfig.week_count)} required />
            <InputField label="Libellé rectangle 1" name="week_label" defaultValue={newAndUpcomingConfig.week_label} required />
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-max-cyan">Rectangle 2 (Séries du mois)</h4>
            <InputField label="Nombre de séries ce mois" name="series_count" type="number" defaultValue={String(newAndUpcomingConfig.series_count)} required />
            <InputField label="Libellé rectangle 2" name="series_label" defaultValue={newAndUpcomingConfig.series_label} required />
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-max-cyan">Rectangle 3 (Films du mois)</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <InputField label="Nombre de films ce mois" name="movies_count" type="number" defaultValue={String(newAndUpcomingConfig.movies_count)} required />
              <InputField label="Libellé rectangle 3" name="movies_label" defaultValue={newAndUpcomingConfig.movies_label} required />
            </div>
          </div>

          <div className="lg:col-span-2">
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black hover:bg-max-cyan transition-colors">
              Enregistrer la section « Nouveautés & À venir »
            </button>
          </div>
        </form>
      </AdminPanel>

      {/* Configuration de la section « Événements sportifs en direct sur HBO Max » */}
      <AdminPanel className="p-5 mb-6 border-cyan-500/30">
        <h3 className="text-lg font-black text-white">Section Accueil : « Événements sportifs en direct » (Eurosport)</h3>
        <p className="mt-1 text-xs text-white/60">
          Personnalisez le titre, sous-titre, image de fond et le bouton d&apos;action de la section sport.
        </p>
        <form action={saveSportsSectionConfigAction} className="mt-5 grid gap-5 lg:grid-cols-2">
          <InputField label="Titre de la section" name="section_title" defaultValue={sportsConfig.section_title} required />
          <InputField label="Texte du bouton blanc" name="button_text" defaultValue={sportsConfig.button_text} required />
          <InputField label="Lien du bouton blanc" name="button_link" defaultValue={sportsConfig.button_link} required />
          <InputField label="URL Image de fond (Background)" name="background_url" defaultValue={sportsConfig.background_url} required />
          <div className="lg:col-span-2">
            <TextAreaField label="Sous-titre de la section" name="section_subtitle" rows={2} defaultValue={sportsConfig.section_subtitle} required />
          </div>

          <div className="lg:col-span-2 mt-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-max-cyan">
              5 Cartes Événements « En avant » (format paysage)
            </h4>
            <p className="mt-1 text-xs text-white/60">
              Personnalisez les 5 cartes paysage à droite : titre de l&apos;événement, sous-titre de la date, tag du sport (Cyclisme, Tennis...), compteur de jours (ex: « Commence dans 14 jours ») et synopsis.
            </p>
          </div>

          {[0, 1, 2, 3, 4].map((i) => {
            const ev = sportsConfig.featured_events?.[i];
            return (
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Événement #{i + 1} {ev?.title ? `— ${ev.title}` : ""}
                  </span>
                  <input type="hidden" name={`event_${i}_id`} defaultValue={ev?.id || `event-${i}`} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Titre de l'événement" name={`event_${i}_title`} defaultValue={ev?.title || ""} required />
                  <InputField label="Date de sortie de l'événement" name={`event_${i}_subtitle`} defaultValue={ev?.subtitle || ""} placeholder="Ex: 4 juillet 2026" required />
                  <InputField label="Heure de sortie (avec tiret auto)" name={`event_${i}_time`} defaultValue={ev?.event_time || ""} placeholder="Ex: 12h15 ou 20:45" />
                  <InputField label="Tag du sport (texte à droite)" name={`event_${i}_tag`} defaultValue={ev?.tag || "SPORT"} placeholder="Ex: CYCLISME, TENNIS..." required />
                  <InputField label="Compteur (Jours ou compte à rebours 24h)" name={`event_${i}_countdown`} defaultValue={ev?.countdown_text || ""} placeholder="Ex: Commence dans 14 jours ou 23:59:00" />
                  <InputField label="URL Image (Format Paysage)" name={`event_${i}_image`} defaultValue={ev?.image_url || ""} required />
                  <InputField label="Lien au clic" name={`event_${i}_link`} defaultValue={ev?.link_url || "/actualites"} />
                </div>
                <TextAreaField label="Pitch / Synopsis de l'événement" name={`event_${i}_synopsis`} rows={2} defaultValue={ev?.synopsis || ""} />
              </div>
            );
          })}

          <div className="lg:col-span-2 mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-black uppercase tracking-wider text-max-cyan">
              Section de gauche : Événements sportifs liste compacte (format paysage réduit)
            </h4>
            <p className="mt-1 text-xs text-white/60">
              Personnalisez les événements de la colonne de gauche : récurrence au-dessus du titre (ex: « Tous les lundis », « Tous les jours »), titre, date de sortie, heure de sortie à droite et compte à rebours texte automatique (&lt; 24h) ou en jours.
            </p>
          </div>

          {Array.from({ length: Math.max(10, sportsConfig.compact_events?.length || 10) }).map((_, i) => {
            const cev = sportsConfig.compact_events?.[i];
            return (
              <div key={`compact-${i}`} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Événement compact #{i + 1} {cev?.title ? `— ${cev.title}` : ""}
                  </span>
                  <input type="hidden" name={`compact_${i}_id`} defaultValue={cev?.id || `compact-${i}`} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Récurrence (au-dessus du titre)" name={`compact_${i}_recurrence`} defaultValue={cev?.recurrence || ""} placeholder="Ex: Tous les lundis, Chaque vendredi..." />
                  <InputField label="Titre de l'événement" name={`compact_${i}_title`} defaultValue={cev?.title || ""} placeholder={i < 10 ? "Titre obligatoire pour afficher l'événement" : "Laisser vide si non utilisé"} />
                  <InputField label="Date de sortie (sous-titre)" name={`compact_${i}_subtitle`} defaultValue={cev?.subtitle || ""} placeholder="Ex: Lundi 13 avril 2026" />
                  <InputField label="Heure de sortie (à droite)" name={`compact_${i}_time`} defaultValue={cev?.event_time || ""} placeholder="Ex: 18h30 ou 20:45" />
                  <InputField label="Compteur (Jours ou HH:MM:SS)" name={`compact_${i}_countdown`} defaultValue={cev?.countdown_text || ""} placeholder="Ex: Commence dans 4 jours ou 23:59:00" />
                  <InputField label="URL Image (miniature paysage)" name={`compact_${i}_image`} defaultValue={cev?.image_url || ""} placeholder="https://..." />
                  <InputField label="Lien au clic" name={`compact_${i}_link`} defaultValue={cev?.link_url || "/actualites"} />
                </div>
              </div>
            );
          })}

          <div className="lg:col-span-2">
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black hover:bg-max-cyan transition-colors">
              Enregistrer la section « Événements sportifs en direct »
            </button>
          </div>
        </form>
      </AdminPanel>

      {/* Configuration de la nouvelle section « Encore plus d'actualités » */}
      <AdminPanel className="p-5 mb-6 border-max-cyan/30">
        <h3 className="text-lg font-black text-white">Section Accueil : « Encore plus d&apos;actualités »</h3>
        <p className="mt-1 text-xs text-white/60">
          Personnalisez le titre de la section (9 articles en 3×3), l&apos;accroche de la newsletter et le titre de la colonne latérale.
        </p>
        <form action={saveMoreNewsSectionConfigAction} className="mt-5 grid gap-5 lg:grid-cols-2">
          <InputField label="Titre de la section" name="section_title" defaultValue={moreNewsConfig.section_title} required />
          <InputField label="Titre colonne latérale (articles carrés)" name="sidebar_title" defaultValue={moreNewsConfig.sidebar_title} required />
          <InputField label="Titre de la newsletter" name="newsletter_title" defaultValue={moreNewsConfig.newsletter_title} required />
          <TextAreaField label="Accroche / Sous-titre newsletter" name="newsletter_subtitle" rows={2} defaultValue={moreNewsConfig.newsletter_subtitle} required />
          <div className="lg:col-span-2">
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black hover:bg-max-cyan transition-colors">
              Enregistrer la section « Encore plus d&apos;actualités »
            </button>
          </div>
        </form>
      </AdminPanel>

      {/* Configuration de la section « Prochainement sur HBO Max » (Nouveaux épisodes de la semaine) */}
      <AdminPanel className="p-5 mb-6 border-cyan-500/30">
        <h3 className="text-lg font-black text-white">Section Accueil : « Prochainement sur HBO Max » (Nouveaux épisodes de la semaine)</h3>
        <p className="mt-1 text-xs text-white/60">
          Personnalisez le titre, sous-titre, bouton et les nouveaux épisodes de la semaine (5 cartes EN AVANT à droite + liste compacte à gauche).
        </p>
        <form action={saveUpcomingEpisodesSectionConfigAction} className="mt-5 grid gap-5 lg:grid-cols-2">
          <InputField label="Titre de la section" name="section_title" defaultValue={upcomingEpisodesConfig.section_title} required />
          <InputField label="Texte du bouton blanc" name="button_text" defaultValue={upcomingEpisodesConfig.button_text} required />
          <InputField label="Lien du bouton blanc" name="button_link" defaultValue={upcomingEpisodesConfig.button_link} required />
          <InputField label="URL du fond" name="background_url" defaultValue={upcomingEpisodesConfig.background_url || "https://i.ibb.co/GfJ3GBvY/Bandes-diagonales-abstraites-bleu-nuit.png"} required />
          <div className="lg:col-span-2">
            <TextAreaField label="Sous-titre de la section" name="section_subtitle" rows={2} defaultValue={upcomingEpisodesConfig.section_subtitle} required />
          </div>

          <div className="lg:col-span-2 mt-2 pt-4 border-t border-white/10">
            <h4 className="text-sm font-black uppercase tracking-wider text-max-cyan">
              Section de droite : Les 5 épisodes « EN AVANT » (format paysage 16:9)
            </h4>
            <p className="mt-1 text-xs text-white/60">
              Personnalisez les 5 cartes à la une : Titre de la série, numéro d&apos;épisode (ex: « Épisode 1 »), nom de l&apos;épisode, horaire de sortie, tag et synopsis.
            </p>
          </div>

          {Array.from({ length: 5 }).map((_, i) => {
            const ep = upcomingEpisodesConfig.featured_episodes?.[i];
            return (
              <div key={`featured-${i}`} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Épisode EN AVANT #{i + 1} {ep?.series_title ? `— ${ep.series_title}` : ""}
                  </span>
                  <input type="hidden" name={`featured_${i}_id`} defaultValue={ep?.id || `ep-${i}`} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Titre de la série" name={`featured_${i}_series_title`} defaultValue={ep?.series_title || ""} required />
                  <InputField label="Numéro d'épisode" name={`featured_${i}_episode_number`} defaultValue={ep?.episode_number || "Épisode 1"} required />
                  <InputField label="Nom de l'épisode (si disponible)" name={`featured_${i}_episode_title`} defaultValue={ep?.episode_title || ""} placeholder="Ex: Dans les profondeurs de l'Amérique" />
                  <InputField label="Jour de sortie" name={`featured_${i}_release_day`} defaultValue={ep?.release_day || "Tous les lundis"} required />
                  <InputField label="Heure de sortie" name={`featured_${i}_release_time`} defaultValue={ep?.release_time || "03h00"} required />
                  <InputField label="Tag (texte à droite)" name={`featured_${i}_tag`} defaultValue={ep?.tag || "HBO ORIGINAL"} required />
                  <InputField label="Bandeau statut / décompte" name={`featured_${i}_countdown`} defaultValue={ep?.countdown_text || "DISPONIBLE DÈS 03H00 (VF & VOSTFR)"} />
                  <InputField label="URL Image Paysage (16:9)" name={`featured_${i}_image`} defaultValue={ep?.image_url || ""} required />
                  <InputField label="Lien au clic" name={`featured_${i}_link`} defaultValue={ep?.link_url || "/prochainement"} />
                </div>
                <TextAreaField label="Pitch / Synopsis de l'épisode" name={`featured_${i}_synopsis`} rows={2} defaultValue={ep?.synopsis || ""} />
              </div>
            );
          })}

          <div className="lg:col-span-2 mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-black uppercase tracking-wider text-max-cyan">
              Section de gauche : Liste compacte des épisodes de la semaine
            </h4>
            <p className="mt-1 text-xs text-white/60">
              Personnalisez les épisodes de la colonne de gauche : récurrence (ex: « TOUS LES LUNDIS », « CE VENDREDI »), titre série, numéro épisode, nom de l&apos;épisode et heure de sortie.
            </p>
          </div>

          {Array.from({ length: Math.max(8, upcomingEpisodesConfig.compact_episodes?.length || 8) }).map((_, i) => {
            const cep = upcomingEpisodesConfig.compact_episodes?.[i];
            return (
              <div key={`compact-${i}`} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Épisode compact #{i + 1} {cep?.series_title ? `— ${cep.series_title}` : ""}
                  </span>
                  <input type="hidden" name={`compact_${i}_id`} defaultValue={cep?.id || `c-ep-${i}`} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Récurrence / Jour" name={`compact_${i}_recurrence`} defaultValue={cep?.recurrence || "TOUS LES LUNDIS"} />
                  <InputField label="Titre de la série" name={`compact_${i}_series_title`} defaultValue={cep?.series_title || ""} required />
                  <InputField label="Numéro d'épisode" name={`compact_${i}_episode_number`} defaultValue={cep?.episode_number || "Épisode 1"} required />
                  <InputField label="Nom de l'épisode (si disponible)" name={`compact_${i}_episode_title`} defaultValue={cep?.episode_title || ""} />
                  <InputField label="Heure de sortie" name={`compact_${i}_time`} defaultValue={cep?.release_time || "03h00"} />
                  <InputField label="Date / badge" name={`compact_${i}_countdown`} defaultValue={cep?.countdown_text || ""} placeholder="Ex: Ce lundi, En ligne..." />
                  <InputField label="URL Vignette (16:9)" name={`compact_${i}_image`} defaultValue={cep?.image_url || ""} required />
                  <InputField label="Lien au clic" name={`compact_${i}_link`} defaultValue={cep?.link_url || "/prochainement"} />
                </div>
              </div>
            );
          })}

          <div className="lg:col-span-2 mt-3">
            <button className="rounded-md bg-max-blue px-6 py-3.5 font-bold text-black hover:bg-max-cyan transition-colors cursor-pointer">
              Enregistrer la section « Prochainement sur HBO Max »
            </button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel className="p-5">
        <h3 className="text-lg font-black text-white mb-4">Réglages généraux du site</h3>
        <form action={saveSiteSettings} className="grid gap-5 lg:grid-cols-2">
          <InputField label="Nom du site" name="site_name" defaultValue={settings.site_name || "QuoiSurHBOMax"} />
          <InputField label="Logo URL" name="logo_url" defaultValue={settings.logo_url || "/hbo-max-actu.png"} />
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
