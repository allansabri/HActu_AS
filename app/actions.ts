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
