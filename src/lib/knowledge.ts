import { KNOWLEDGE_DOCS } from "./knowledge-base";
import type { Language, ScamCategory } from "./types";

export { KNOWLEDGE_DOCS } from "./knowledge-base";
export type { KnowledgeDoc } from "./knowledge-base";

/**
 * Grounded citations.
 *
 * The knowledge base is generated from data/knowledge-sources.jsonl and only
 * cites sources whose URL returned HTTP 200-399 in the last verification run
 * (`scripts/verify-knowledge.mjs`). If a language has no verified match we fall
 * back to English rather than inventing a claim.
 */
export function citationsFor(
  category: ScamCategory,
  lang: Language,
): { doc_id: string; title: string; claim: string; url: string }[] {
  const verifiedFor = (language: Language) =>
    KNOWLEDGE_DOCS.filter(
      (doc) => doc.verified && doc.language === language && doc.categories.includes(category),
    );

  const primary = verifiedFor(lang);
  const pool =
    primary.length >= 2 ? primary : [...primary, ...verifiedFor("en"), ...verifiedFor("id")];
  const fallback = pool.length > 0 ? pool : KNOWLEDGE_DOCS.filter((doc) => doc.verified);

  const seen = new Set<string>();
  return fallback
    .filter((doc) => {
      if (seen.has(doc.source_url)) return false;
      seen.add(doc.source_url);
      return true;
    })
    .slice(0, 2)
    .map((doc) => ({
      doc_id: doc.id,
      title: doc.title,
      claim: doc.claim,
      url: doc.source_url,
    }));
}

export function knowledgeStats(): { total: number; verified: number; byLanguage: Record<string, number> } {
  return {
    total: KNOWLEDGE_DOCS.length,
    verified: KNOWLEDGE_DOCS.filter((doc) => doc.verified).length,
    byLanguage: KNOWLEDGE_DOCS.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.language] = (acc[doc.language] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
