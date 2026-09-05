"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { upsertProductionCompany } from "@/app/admin/actions";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { ProductionCompany, ProductionCompanyContact } from "@/lib/types";

type ContactDraft = Partial<ProductionCompanyContact> & { localId: string };

export function ProductionCompanyForm({
  company,
  contacts = []
}: {
  company?: ProductionCompany;
  contacts?: ProductionCompanyContact[];
}) {
  const [rows, setRows] = useState<ContactDraft[]>(
    contacts.length
      ? contacts.map((contact) => ({ ...contact, localId: contact.id }))
      : [{ localId: "new-contact", label: "Bureau principal" }]
  );

  return (
    <form action={upsertProductionCompany} className="space-y-4 rounded-lg border border-white/10 bg-[#101318]/85 p-5">
      {company ? <input type="hidden" name="id" value={company.id} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <InputField label="Nom de l'entreprise" name="name" defaultValue={company?.name} required />
        <InputField label="Identifiant URL" name="slug" defaultValue={company?.slug} placeholder="hbo" />
        <InputField label="Type" name="company_type" defaultValue={company?.company_type} placeholder="Production, distributeur..." />
        <InputField label="Pays" name="country" defaultValue={company?.country} />
        <InputField label="Identifiant IMDb" name="imdb_id" defaultValue={company?.imdb_id} placeholder="co0000000" />
        <InputField label="Logo" name="logo_url" defaultValue={company?.logo_url} />
        <InputField label="Site officiel" name="website" defaultValue={company?.website} />
        <InputField label="Page source" name="source_url" defaultValue={company?.source_url} />
      </div>
      <TextAreaField label="Présentation" name="description" rows={3} defaultValue={company?.description} />

      <div className="rounded-md border border-white/10 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-black">Bureaux et contacts</p>
          <button
            type="button"
            onClick={() => setRows((current) => [...current, { localId: crypto.randomUUID(), label: "" }])}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
          >
            <Plus size={15} /> Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {rows.map((contact, index) => (
            <div key={contact.localId} className="grid gap-3 border-t border-white/10 pt-4 first:border-0 first:pt-0 md:grid-cols-2 xl:grid-cols-4">
              <InputField label="Libellé" name="contact_label" defaultValue={contact.label} placeholder="Bureau de Paris" />
              <InputField label="Ville" name="contact_city" defaultValue={contact.city} />
              <InputField label="Adresse" name="contact_address" defaultValue={contact.address} />
              <InputField label="Téléphone" name="contact_phone" defaultValue={contact.phone} />
              <InputField label="E-mail" name="contact_email" type="email" defaultValue={contact.email} />
              <InputField label="Site du bureau" name="contact_website" defaultValue={contact.website} />
              <button
                type="button"
                aria-label={`Supprimer le contact ${index + 1}`}
                onClick={() => setRows((current) => current.filter((row) => row.localId !== contact.localId))}
                className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-md border border-red-300/25 px-3 text-sm text-red-200 hover:bg-red-500/10"
              >
                <Trash2 size={15} /> Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">
        {company ? "Mettre à jour l'entreprise" : "Ajouter l'entreprise"}
      </button>
    </form>
  );
}
