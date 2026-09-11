import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';

export const prerender = false;

// Lane colors matching site palette (global.css)
const LANE_COLORS: Record<string, string> = {
  research:   '#22d3f0',
  analysis:   '#f59e0b',
  'build-logs': '#a78bfa',
};

const LANE_LABELS: Record<string, string> = {
  research:   'RESEARCH',
  analysis:   'ANALYSIS',
  'build-logs': 'BUILD LOGS',
};

const SITE_BG        = '#070810';
const SITE_ACCENT    = '#8b5cf6';
const TEXT_PRIMARY   = '#f0f2ff';
const TEXT_SECONDARY = '#8890b8';
const BORDER_COLOR   = '#1e2240';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ url }) => {
  const slug  = url.searchParams.get('slug')  ?? '';
  const lane  = url.searchParams.get('lane')  ?? 'analysis';
  const title = url.searchParams.get('title') ?? slug.replace(/-/g, ' ');

  const displayTitle = truncate(title, 60);
  const laneColor = LANE_COLORS[lane] ?? SITE_ACCENT;
  const laneLabel = LANE_LABELS[lane] ?? lane.toUpperCase();

  // Load Inter font (body) — fall back gracefully if CDN unavailable at edge
  const fontData = await loadFont(
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
  );

  const fonts = fontData
    ? [{ name: 'Inter', data: fontData, weight: 400 as const, style: 'normal' as const }]
    : [];

  const element = {
    type: 'div',
    props: {
      style: {
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  'space-between',
        width:           '1200px',
        height:          '630px',
        background:      SITE_BG,
        padding:         '56px 64px',
        fontFamily:      fonts.length ? 'Inter, sans-serif' : 'sans-serif',
        border:          `1px solid ${BORDER_COLOR}`,
        position:        'relative',
      },
      children: [
        // Top row: site URL + accent bar
        {
          type: 'div',
          props: {
            style: {
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily:  'monospace',
                    fontSize:    '18px',
                    color:       TEXT_SECONDARY,
                    letterSpacing: '0.05em',
                  },
                  children: 'cyberdaemon.ai',
                },
              },
              // Lane pill
              {
                type: 'span',
                props: {
                  style: {
                    fontSize:      '13px',
                    fontWeight:    '600',
                    letterSpacing: '0.12em',
                    color:         laneColor,
                    background:    `${laneColor}18`,
                    padding:       '4px 12px',
                    borderRadius:  '4px',
                    border:        `1px solid ${laneColor}40`,
                  },
                  children: laneLabel,
                },
              },
            ],
          },
        },

        // Center: article title
        {
          type: 'div',
          props: {
            style: {
              display:    'flex',
              flex:       '1',
              alignItems: 'center',
              padding:    '40px 0 32px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize:     displayTitle.length > 40 ? '48px' : '56px',
                    fontWeight:   '700',
                    color:        TEXT_PRIMARY,
                    lineHeight:   '1.2',
                    letterSpacing: '-0.02em',
                    maxWidth:     '960px',
                  },
                  children: displayTitle,
                },
              },
            ],
          },
        },

        // Bottom row: accent line + URL
        {
          type: 'div',
          props: {
            style: {
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            },
            children: [
              // Accent bar
              {
                type: 'div',
                props: {
                  style: {
                    width:        '48px',
                    height:       '3px',
                    background:   laneColor,
                    borderRadius: '2px',
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize:      '15px',
                    color:         TEXT_SECONDARY,
                    letterSpacing: '0.04em',
                  },
                  children: 'cyberdaemon.ai',
                },
              },
            ],
          },
        },
      ],
    },
  };

  return new ImageResponse(element as Parameters<typeof ImageResponse>[0], {
    width:  1200,
    height: 630,
    fonts,
  });
};
