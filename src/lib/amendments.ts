import { getCollection } from 'astro:content';

export interface AmendmentRef {
  slug: string;
  lane: string;
  title: string;
}

type Lane = 'research' | 'analysis' | 'build-logs';
const LANES: Lane[] = ['research', 'analysis', 'build-logs'];

/** Strip .md / .mdx extension to get a bare slug comparable to the updates: field. */
function toSlug(id: string): string {
  return id.replace(/\.(mdx|md)$/, '');
}

/**
 * For a given article entry ID (may include extension), find all articles
 * whose updates: field matches the bare slug.
 */
export async function getAmendments(targetId: string): Promise<AmendmentRef[]> {
  const targetSlug = toSlug(targetId);
  const results: AmendmentRef[] = [];
  for (const lane of LANES) {
    const entries = await getCollection(lane, (e) => !e.data.draft);
    for (const entry of entries) {
      if (entry.data.updates !== undefined && toSlug(entry.data.updates) === targetSlug) {
        results.push({ slug: toSlug(entry.id), lane, title: entry.data.title });
      }
    }
  }
  return results;
}

/**
 * For an article that has updates: "some-slug", resolve the original
 * article's title + lane. Handles bare slugs and slugs with extensions.
 */
export async function getOriginalArticle(updatesSlug: string): Promise<AmendmentRef | null> {
  const normalizedTarget = toSlug(updatesSlug);
  for (const lane of LANES) {
    const entries = await getCollection(lane, (e) => !e.data.draft);
    const match = entries.find((e) => toSlug(e.id) === normalizedTarget);
    if (match) {
      return { slug: toSlug(match.id), lane, title: match.data.title };
    }
  }
  return null;
}
