import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login?error=no_session");
  }

  const { data, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError) {
    console.error("Erreur vérification rôle:", roleError);
  }

  if (!data) {
    redirect(`/admin/login?error=role&uid=${user.id}`);
  }
  return user;
}
