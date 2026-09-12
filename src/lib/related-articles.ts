import { getCollection } from 'astro:content';

export interface RelatedArticle {
  slug: string;
  lane: string;
  title: string;
  description: string;
  date: Date;
}

type AnyCollection = 'research' | 'analysis' | 'build-logs';
const LANES: AnyCollection[] = ['research', 'analysis', 'build-logs'];

function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export async function getRelatedArticles(
  currentSlug: string,
  currentLane: string,
  currentTags: string[],
  currentThreads: string[],
  limit = 3,
): Promise<RelatedArticle[]> {
  interface ScoredArticle extends RelatedArticle {
    _score: number;
  }

  const allEntries: ScoredArticle[] = [];

  for (const lane of LANES) {
    const entries = await getCollection(lane, (e) => !e.data.draft);
    for (const entry of entries) {
      // Skip self
      if (entry.id === currentSlug && lane === currentLane) continue;

      const tagScore = jaccard(currentTags, entry.data.tags ?? []);
      const threadScore = jaccard(currentThreads, entry.data.threads ?? []);
      const score = tagScore * 0.6 + threadScore * 0.4;

      if (score > 0) {
        allEntries.push({
          slug: entry.id,
          lane,
          title: entry.data.title,
          description: entry.data.description,
          date: entry.data.date,
          _score: score,
        });
      }
    }
  }

  return allEntries
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ slug, lane, title, description, date }) => ({ slug, lane, title, description, date }));
}
