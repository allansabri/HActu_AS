import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminPanel, AdminShell } from "@/components/admin/AdminShell";
import { ProductionCompanyForm } from "@/components/admin/ProductionCompanyForm";
import { ProductionCompanySections } from "@/components/admin/ProductionCompanySections";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { ProductionCompany, ProductionCompanyContact, ProductionCompanySection, ProductionProject } from "@/lib/types";

export default async function AdminCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const [companyResult, contactsResult, sectionsResult, assignmentsResult, projectsResult] = await Promise.all([
    supabase.from("production_companies").select("*").eq("id", id).single(),
    supabase.from("production_company_contacts").select("*").eq("company_id", id).order("sort_order"),
    supabase.from("production_company_sections").select("*").eq("company_id", id).order("sort_order").order("name"),
    supabase.from("production_company_section_projects").select("section_id,project_id"),
    supabase.from("production_projects").select("id,title,status,type,imdb_id,poster_url,image_url").order("title").limit(5000)
  ]);
  if (!companyResult.data) notFound();

  const company = companyResult.data as ProductionCompany;
  const contacts = (contactsResult.data || []) as ProductionCompanyContact[];
  const sections = (sectionsResult.data || []) as ProductionCompanySection[];
  const assignments = (assignmentsResult.data || []) as Array<{ section_id: string; project_id: string }>;
  const projects = (projectsResult.data || []) as Array<Pick<ProductionProject, "id" | "title" | "status" | "type" | "imdb_id" | "poster_url" | "image_url">>;

  return (
    <AdminShell title={company.name} subtitle="Catégories, imports et rattachements aux fiches détaillées." userLabel={user.email?.split("@")[0] || "Admin"}>
      <Link href="/admin/entreprises" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white">
        <ArrowLeft size={16} /> Toutes les entreprises
      </Link>
      <AdminPanel className="mb-6 p-5">
        <details>
          <summary className="cursor-pointer list-none font-black">Modifier la fiche entreprise</summary>
          <div className="mt-5 border-t border-white/10 pt-5"><ProductionCompanyForm company={company} contacts={contacts} /></div>
        </details>
      </AdminPanel>
      <AdminPanel className="p-5">
        <ProductionCompanySections company={company} sections={sections} assignments={assignments} projects={projects} />
      </AdminPanel>
    </AdminShell>
  );
}
