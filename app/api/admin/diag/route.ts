import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  const result: {
    configured: boolean;
    url: string;
    keyConfigured: boolean;
    pingOk: boolean;
    tables: Record<string, { ok: boolean; count?: number | null; error?: string }>;
    error?: string;
  } = {
    configured: isSupabaseConfigured,
    url: supabaseUrl,
    keyConfigured: Boolean(supabaseAnonKey && !supabaseAnonKey.includes("placeholder")),
    pingOk: false,
    tables: {}
  };

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test tables
    const tablesToTest = ["articles", "user_roles", "profiles", "production_projects", "top_10_france"];

    for (const table of tablesToTest) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        if (error) {
          result.tables[table] = { ok: false, error: error.message };
        } else {
          result.tables[table] = { ok: true, count: count ?? 0 };
        }
      } catch (err: any) {
        result.tables[table] = { ok: false, error: err.message };
      }
    }

    result.pingOk = true;
    return NextResponse.json(result);
  } catch (err: any) {
    result.error = err?.message || "Erreur inconnue";
    return NextResponse.json(result, { status: 500 });
  }
}
