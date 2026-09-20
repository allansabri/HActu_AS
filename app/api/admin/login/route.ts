import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        {
          error: "CONFIGURATION INCOMPLÈTE : Les clés Supabase ne sont pas configurées.",
          step: "config",
          isConfigError: true
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim();
    const password = String(body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre email et mot de passe.", step: "validation" },
        { status: 400 }
      );
    }

    // Response that will carry the session cookies
    const response = NextResponse.json({ success: true, redirect: "/admin" });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              sameSite: "none",
              secure: true,
              path: "/"
            });
          });
        }
      }
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Supabase auth error:", error);
      let userFriendlyMessage = error.message;

      if (error.message === "Invalid login credentials") {
        userFriendlyMessage =
          "Email ou mot de passe incorrect. Vérifiez vos identifiants sur Supabase (Authentication > Users).";
      } else if (error.message.toLowerCase().includes("email not confirmed")) {
        userFriendlyMessage =
          "L'email n'a pas encore été confirmé dans Supabase. Allez dans Supabase > Authentication > Users pour marquer l'utilisateur comme confirmé, ou désactivez 'Confirm email' dans Authentication > Providers.";
      }

      return NextResponse.json(
        {
          error: userFriendlyMessage,
          rawError: error.message,
          step: "auth"
        },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable après authentification.", step: "user" },
        { status: 400 }
      );
    }

    // Authenticated query for role using user's bearer token
    const token = data.session?.access_token;
    const authClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      global: token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : undefined
    });

    const { data: roleRow, error: roleError } = await authClient
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Erreur vérification rôle:", roleError);
    }

    if (!roleRow) {
      return NextResponse.json(
        {
          error: `Authentification réussie pour ${data.user.email}, mais le rôle 'admin' n'est pas encore présent dans la table 'user_roles' pour l'ID ${data.user.id}.`,
          userId: data.user.id,
          step: "role",
          needsRole: true
        },
        { status: 403 }
      );
    }

    return response;
  } catch (err: any) {
    console.error("Login API exception:", err);
    return NextResponse.json(
      {
        error: err?.message || "Erreur lors de la tentative de connexion.",
        step: "exception"
      },
      { status: 500 }
    );
  }
}
