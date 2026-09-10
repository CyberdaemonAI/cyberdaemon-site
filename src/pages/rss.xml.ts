import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const buildLogs = await getCollection('build-logs');
  const research  = await getCollection('research');
  const analysis  = await getCollection('analysis');

  const all = [...buildLogs, ...research, ...analysis]
    .filter(a => !a.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'cyberdaemon.ai',
    description: 'Casey Gager — AI security practitioner and researcher.',
    site: context.site!,
    items: all.map(article => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: `/${article.collection}/${article.id}/`,
    })),
  });
}
