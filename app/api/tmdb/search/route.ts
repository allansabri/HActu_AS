import { NextRequest, NextResponse } from "next/server";
import { searchTmdb, getTmdbBackdrops, getTmdbTitleDetails } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const mediaType = (searchParams.get("type") as "movie" | "tv") || "tv";
  const idStr = searchParams.get("id");

  // Mode 1: Récupérer les fonds d'écran textless pour un titre donné (id + type)
  if (idStr) {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    try {
      const backdrops = await getTmdbBackdrops(mediaType, id);
      return NextResponse.json({ backdrops });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Erreur TMDB" }, { status: 500 });
    }
  }

  // Mode 2: Recherche de films / séries
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTmdb(query.trim());
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur TMDB" }, { status: 500 });
  }
}
