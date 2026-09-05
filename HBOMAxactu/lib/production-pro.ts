import { demoProductions } from "@/lib/demo-data";
import { slugify } from "@/lib/format";
import { supabasePublic } from "@/lib/supabase-public";
import {
  ProductionCompany,
  ProductionCompanyContact,
  ProductionCredit,
  ProductionEpisode,
  ProductionMedia,
  ProductionProject,
  ProductionProjectPro,
  ProductionStatusHistory
} from "@/lib/types";

const demoCompanies: ProductionCompany[] = [
  { id: "demo-company-hbo", name: "HBO", slug: "hbo", company_type: "Diffuseur / société de production", country: "États-Unis", logo_url: null, website: "https://www.hbo.com", description: "Chaîne premium et studio à l'origine de nombreuses séries HBO Original.", imdb_id: null, source_url: null },
  { id: "demo-company-max", name: "Max", slug: "max", company_type: "Plateforme de streaming", country: "États-Unis", logo_url: null, website: "https://www.max.com", description: "Plateforme de streaming de Warner Bros. Discovery.", imdb_id: null, source_url: null },
  { id: "demo-company-warner-bros", name: "Warner Bros.", slug: "warner-bros", company_type: "Studio / distributeur", country: "États-Unis", logo_url: null, website: "https://www.warnerbros.com", description: "Studio de cinéma et de télévision.", imdb_id: null, source_url: null }
];

function companyMatchesProject(company: ProductionCompany, project: ProductionProject) {
  const text = `${project.production_company || ""} ${project.platform || ""}`.toLowerCase();
  if (company.slug === "hbo") return text.includes("hbo");
  if (company.slug === "max") return text.includes("max");
  if (company.slug === "warner-bros") return text.includes("warner");
  return text.includes(company.name.toLowerCase());
}

export async function getProductionCompanies() {
  const { data, error } = await supabasePublic.from("production_companies").select("*").order("name");
  return error || !data?.length ? demoCompanies : (data as ProductionCompany[]);
}

export async function getProductionCompanyBySlug(slug: string) {
  const { data, error } = await supabasePublic.from("production_companies").select("*").eq("slug", slug).single();
  const company = !error && data ? data as ProductionCompany : demoCompanies.find((item) => item.slug === slug) || null;
  if (!company) return null;

  const [{ data: contacts }, { data: relations }, { data: projects }] = await Promise.all([
    supabasePublic.from("production_company_contacts").select("*").eq("company_id", company.id).order("sort_order"),
    supabasePublic.from("production_project_companies").select("project_id,role").eq("company_id", company.id),
    supabasePublic.from("production_projects").select("*").order("updated_at", { ascending: false })
  ]);

  const allProjects = (projects?.length ? projects : demoProductions) as ProductionProject[];
  const relationIds = new Set((relations || []).map((item) => item.project_id));
  const companyProjects = allProjects.filter((project) => relationIds.has(project.id) || companyMatchesProject(company, project));
  return {
    company,
    contacts: (contacts || []) as ProductionCompanyContact[],
    projects: companyProjects
  };
}

export async function getProductionProjectPro(project: ProductionProject): Promise<ProductionProjectPro> {
  const [relationsResult, creditsResult, mediaResult, episodesResult, statusResult] = await Promise.all([
    supabasePublic.from("production_project_companies").select("company_id,role,production_companies(*)").eq("project_id", project.id),
    supabasePublic.from("production_credits").select("*").eq("project_id", project.id).order("sort_order"),
    supabasePublic.from("production_media").select("*").eq("project_id", project.id).order("sort_order"),
    supabasePublic.from("production_episodes").select("*").eq("project_id", project.id).order("season_number").order("episode_number"),
    supabasePublic.from("production_status_history").select("*").eq("project_id", project.id).order("sort_order")
  ]);

  let companies = (relationsResult.data || [])
    .map((item) => item.production_companies)
    .filter(Boolean) as unknown as ProductionCompany[];
  if (!companies.length) companies = demoCompanies.filter((company) => companyMatchesProject(company, project));

  const companyIds = companies.map((company) => company.id);
  const contactsResult = companyIds.length
    ? await supabasePublic.from("production_company_contacts").select("*").in("company_id", companyIds).order("sort_order")
    : { data: [] };

  const media = (mediaResult.data || []) as ProductionMedia[];
  if (!media.length) {
    if (project.poster_url || project.image_url) media.push({ id: "fallback-poster", project_id: project.id, media_type: "poster", title: "Affiche", url: project.poster_url || project.image_url || "", thumbnail_url: null, caption: null, credit: null, sort_order: 0 });
    if (project.banner_url) media.push({ id: "fallback-banner", project_id: project.id, media_type: "image", title: "Bannière", url: project.banner_url, thumbnail_url: null, caption: null, credit: null, sort_order: 1 });
    if (project.trailer_url) media.push({ id: "fallback-trailer", project_id: project.id, media_type: "video", title: "Bande-annonce", url: project.trailer_url, thumbnail_url: null, caption: null, credit: null, sort_order: 2 });
  }

  const statusHistory = (statusResult.data || []) as ProductionStatusHistory[];
  if (!statusHistory.length) {
    statusHistory.push({ id: "fallback-status", project_id: project.id, status: project.status, status_date: project.updated_at?.slice(0, 10) || null, details: null, sort_order: 0 });
  }

  return {
    project,
    companies,
    contacts: (contactsResult.data || []) as ProductionCompanyContact[],
    credits: (creditsResult.data || []) as ProductionCredit[],
    media,
    episodes: (episodesResult.data || []) as ProductionEpisode[],
    statusHistory
  };
}

export function companySlugFromName(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("warner")) return "warner-bros";
  if (normalized.includes("hbo")) return "hbo";
  if (normalized === "max" || normalized.includes("hbo max")) return "max";
  return slugify(name);
}
