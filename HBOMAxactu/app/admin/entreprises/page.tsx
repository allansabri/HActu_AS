import Link from "next/link";
import { Building2, ChevronRight, Plus } from "lucide-react";
import { deleteProductionCompany } from "@/app/admin/actions";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { ProductionCompanyForm } from "@/components/admin/ProductionCompanyForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { ProductionCompany } from "@/lib/types";

export default async function AdminCompaniesPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const [{ data: companiesData }, { data: sectionsData }, { data: assignmentsData }] = await Promise.all([
    supabase.from("production_companies").select("*").order("name"),
    supabase.from("production_company_sections").select("id,company_id"),
    supabase.from("production_company_section_projects").select("section_id")
  ]);
  const companies = (companiesData || []) as ProductionCompany[];
  const sections = sectionsData || [];
  const assignments = assignmentsData || [];

  return (
    <AdminShell
      title="Entreprises de production"
      subtitle="Gère les sociétés, leurs catégories personnalisées et les projets rattachés."
      userLabel={user.email?.split("@")[0] || "Admin"}
    >
      <AdminPanel className="mb-6">
        <details>
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-black">
            <Plus size={17} /> Ajouter une entreprise
          </summary>
          <div className="border-t border-white/10 p-5"><ProductionCompanyForm /></div>
        </details>
      </AdminPanel>
      <div className="grid gap-4 xl:grid-cols-2">
        {companies.map((company) => {
          const companySections = sections.filter((section) => section.company_id === company.id);
          const sectionIds = new Set(companySections.map((section) => section.id));
          const projectCount = assignments.filter((assignment) => sectionIds.has(assignment.section_id)).length;
          return (
            <AdminPanel key={company.id} className="p-5">
              <div className="flex items-start gap-4">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="" className="h-16 w-20 shrink-0 object-contain" />
                ) : (
                  <span className="grid h-16 w-20 shrink-0 place-items-center bg-white/5 text-sm font-black text-white/45">{company.name.slice(0, 3).toUpperCase()}</span>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-black">{company.name}</h2>
                  <p className="mt-1 text-sm text-white/50">{company.company_type || "Entreprise"} · {company.country || "Pays non renseigné"}</p>
                  <p className="mt-3 text-xs text-white/45">{companySections.length} catégorie(s) · {projectCount} rattachement(s)</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/admin/entreprises/${company.id}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-black hover:bg-[#8EA1AC]">
                  <Building2 size={16} /> Gérer <ChevronRight size={15} />
                </Link>
                <form action={deleteProductionCompany}>
                  <input type="hidden" name="id" value={company.id} />
                  <button className="h-10 rounded-md border border-red-300/25 px-4 text-sm font-bold text-red-200 hover:bg-red-500/10">Supprimer</button>
                </form>
              </div>
            </AdminPanel>
          );
        })}
      </div>
      {!companies.length ? <EmptyState title="Aucune entreprise" text="Crée HBO, Max, Warner Bros. ou une autre société." /> : null}
    </AdminShell>
  );
}
