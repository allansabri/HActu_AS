import { slugify } from "@/lib/format";
import { ContentType } from "@/lib/types";

export function titleHref(type: ContentType, title: string) {
  return `/titres/${type}/${slugify(title)}?title=${encodeURIComponent(title)}`;
}

export function productionHref(id: string) {
  return `/productions/${id}`;
}
