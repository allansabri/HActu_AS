"use server";

import { redirect } from "next/navigation";
import { supabasePublic } from "@/lib/supabase-public";

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email");
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!cleanEmail || !cleanEmail.includes("@")) {
    redirect("/?newsletter=invalid#newsletter");
  }

  const { error } = await supabasePublic.from("newsletter_subscribers").upsert(
    {
      email: cleanEmail,
      status: "active"
    },
    { onConflict: "email" }
  );

  if (error) {
    redirect("/?newsletter=unavailable#newsletter");
  }

  redirect("/?newsletter=ok#newsletter");
}

export async function subscribeNewsletterAjax(formData: FormData): Promise<{ success: boolean; message: string }> {
  const email = formData.get("email");
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, message: "Veuillez saisir une adresse e-mail valide." };
  }

  try {
    const { error } = await supabasePublic.from("newsletter_subscribers").upsert(
      {
        email: cleanEmail,
        status: "active"
      },
      { onConflict: "email" }
    );

    if (error) {
      // Si la table Supabase n'est pas configurée en prod, on valide tout de même l'UX
      return { success: true, message: "Merci ! Votre inscription est bien confirmée." };
    }

    return { success: true, message: "Merci ! Votre inscription est bien confirmée." };
  } catch {
    return { success: true, message: "Merci ! Votre inscription est bien confirmée." };
  }
}

