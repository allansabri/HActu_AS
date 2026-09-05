import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { supabaseUrl } from "@/lib/env";
import { syncTmdbProductions } from "@/lib/production-sync";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const providedSecret = new URL(request.url).searchParams.get("secret") || request.headers.get("x-cron-secret");

  if (!secret || providedSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquant. Ajoute-le dans l'environnement serveur pour autoriser le cron." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
  const results = await syncTmdbProductions(supabase);

  revalidatePath("/");
  revalidatePath("/productions");
  revalidatePath("/prochainement");
  revalidatePath("/admin/productions");

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    results
  });
}
