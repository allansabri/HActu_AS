import { NextRequest, NextResponse } from "next/server";
import {
  assignProductionProjectToSection,
  createProductionProjectInSection,
  enrichProductionSectionTmdbBatch,
  finalizeProductionCompanySectionImport,
  importProductionCompanySectionBatch,
  removeProductionProjectFromSection
} from "@/app/admin/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImportRow = Record<string, unknown>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      operation?: "batch" | "finalize" | "enrich" | "assign" | "create" | "remove";
      companyId?: string;
      sectionId?: string;
      projectId?: string;
      project?: { title?: string; type?: string; status?: string; imdbId?: string };
      rows?: ImportRow[];
      projectIds?: string[];
      canRemoveStale?: boolean;
    };

    if (body.operation === "batch") {
      if (!body.companyId || !body.sectionId || !Array.isArray(body.rows) || !body.rows.length) {
        return NextResponse.json({ error: "Lot invalide." }, { status: 400 });
      }
      const result = await importProductionCompanySectionBatch(
        body.companyId,
        body.sectionId,
        body.rows
      );
      return NextResponse.json(result);
    }

    if (body.operation === "finalize") {
      if (!body.sectionId || !Array.isArray(body.projectIds)) {
        return NextResponse.json({ error: "Finalisation invalide." }, { status: 400 });
      }
      await finalizeProductionCompanySectionImport(
        body.sectionId,
        body.projectIds,
        body.canRemoveStale === true
      );
      return NextResponse.json({ ok: true });
    }

    if (body.operation === "enrich") {
      if (!body.sectionId || !Array.isArray(body.projectIds) || !body.projectIds.length) {
        return NextResponse.json({ error: "Lot TMDB invalide." }, { status: 400 });
      }
      const result = await enrichProductionSectionTmdbBatch(body.sectionId, body.projectIds);
      return NextResponse.json(result);
    }

    if (body.operation === "assign") {
      if (!body.companyId || !body.sectionId || !body.projectId) {
        return NextResponse.json({ error: "Rattachement invalide." }, { status: 400 });
      }
      await assignProductionProjectToSection(body.companyId, body.sectionId, body.projectId);
      return NextResponse.json({ ok: true });
    }

    if (body.operation === "create") {
      if (!body.companyId || !body.sectionId || !body.project?.title?.trim()) {
        return NextResponse.json({ error: "Titre du projet obligatoire." }, { status: 400 });
      }
      const result = await createProductionProjectInSection(body.companyId, body.sectionId, {
        title: body.project.title.trim(),
        type: body.project.type,
        status: body.project.status,
        imdbId: body.project.imdbId
      });
      return NextResponse.json(result);
    }

    if (body.operation === "remove") {
      if (!body.companyId || !body.sectionId || !body.projectId) {
        return NextResponse.json({ error: "Retrait invalide." }, { status: 400 });
      }
      await removeProductionProjectFromSection(body.companyId, body.sectionId, body.projectId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Opération inconnue." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur inconnue";
    console.error("[production-section-import]", error);
    const status = /connect|admin|auth|session/i.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
