import { redirect } from "next/navigation";

export default function ContactRedirect() {
  redirect("/a-propos#contact");
}
