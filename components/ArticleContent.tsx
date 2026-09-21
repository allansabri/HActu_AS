import React from "react";
import { ArticleVideoPlayer } from "@/components/ArticleVideoPlayer";

interface ArticleContentProps {
  content: string;
}

function renderInlineText(text: string): React.ReactNode {
  // Regex pour découper les éléments markdown : **gras** et [lien](url)
  const regex = /(\*\*.*?\*\*|\[.*?\]\(https?:\/\/[^\s)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-extrabold text-neutral-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0b2545] font-semibold underline underline-offset-4 decoration-1 hover:text-blue-700 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  // Découpage par blocs (paragraphes séparés par des lignes vides)
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-6 text-[17px] sm:text-[18.5px] leading-[1.8] text-neutral-800">
      {blocks.map((block, idx) => {
        // 1. Détection Titre de section niveau 2 : ## Titre
        if (block.startsWith("## ")) {
          const headingText = block.replace(/^##\s+/, "");
          return (
            <h2
              key={idx}
              className="mt-10 mb-4 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950 pt-3"
            >
              {renderInlineText(headingText)}
            </h2>
          );
        }

        // 2. Détection Titre de section niveau 3 : ### Titre
        if (block.startsWith("### ")) {
          const subHeadingText = block.replace(/^###\s+/, "");
          return (
            <h3
              key={idx}
              className="mt-8 mb-3 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900"
            >
              {renderInlineText(subHeadingText)}
            </h3>
          );
        }

        // 3. Détection vidéo intégrée dans le texte : [video: url]
        const videoTagMatch = block.match(/^\[video:\s*(https?:\/\/[^\s\]]+)\]$/i);
        if (videoTagMatch) {
          return (
            <div key={idx} className="my-8">
              <ArticleVideoPlayer url={videoTagMatch[1]} />
            </div>
          );
        }

        // 4. Détection image markdown: ![Légende](url)
        const mdImageMatch = block.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
        if (mdImageMatch) {
          const caption = mdImageMatch[1];
          const src = mdImageMatch[2];
          return (
            <figure key={idx} className="my-8 overflow-hidden">
              <img
                src={src}
                alt={caption || "Illustration article"}
                className="w-full object-cover max-h-[620px]"
              />
              {caption && (
                <figcaption className="mt-2.5 text-center text-xs sm:text-sm text-neutral-500 italic">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // 5. Détection d'une URL d'image seule sur sa ligne
        const isSingleImageUrl = /^https?:\/\/[^\s]+?\.(jpg|jpeg|png|webp|gif|avif)(\?[^\s]*)?$/i.test(block);
        if (isSingleImageUrl) {
          return (
            <figure key={idx} className="my-8 overflow-hidden">
              <img
                src={block}
                alt="Illustration article"
                className="w-full object-cover max-h-[620px]"
              />
            </figure>
          );
        }

        // 6. Détection citation débutant par "> "
        if (block.startsWith("> ")) {
          const quoteText = block.replace(/^>\s*/, "");
          return (
            <blockquote
              key={idx}
              className="my-7 border-l-2 border-neutral-950 pl-5 pr-4 py-2 italic text-neutral-900 text-lg sm:text-xl font-normal"
            >
              {renderInlineText(quoteText)}
            </blockquote>
          );
        }

        // 7. Paragraphe standard avec support de mots en gras et liens
        return (
          <p key={idx} className="whitespace-pre-line text-neutral-800">
            {renderInlineText(block)}
          </p>
        );
      })}
    </div>
  );
}
