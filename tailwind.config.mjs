/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds — resolved from CSS vars (theme-aware)
        bg:       'var(--color-bg)',
        canvas:   'var(--color-bg)',
        surface:  'var(--color-bg-secondary)',
        border:   'var(--color-border)',
        // Text — semantic tokens
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'text-dim':       'var(--color-text-dim)',
        // Text — legacy aliases
        'ink':         'var(--color-text-primary)',
        'ink-2':       'var(--color-text-secondary)',
        'ink-muted':   'var(--color-text-muted)',
        // Accents — theme-aware
        accent:        'var(--color-accent)',
        teal:          'var(--color-accent)',
        'teal-dim':    'var(--color-teal-dim)',
        // Static accents (not theme-switched)
        gold:          '#c9a84c',
        'gold-dim':    '#8a6400',
        purple:        '#9b8ecf',
        'purple-dim':  '#6b5fa0',
        critical:      '#c1121f',
        'critical-dim':'#8a0d16',
        // Lane accents — theme-aware
        'lane-research':  'var(--color-lane-research)',
        'lane-analysis':  'var(--color-lane-analysis)',
        'lane-buildlog':  'var(--color-lane-buildlog)',
        // Code
        'code-bg':    'var(--color-bg-code-inline)',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'Times New Roman', 'serif'],
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:  ['"IBM Plex Mono"', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['2.5rem',  { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'title':   ['1.875rem',{ lineHeight: '1.25', letterSpacing: '-0.02em'  }],
        'heading': ['1.25rem', { lineHeight: '1.4',  letterSpacing: '-0.01em'  }],
        'body':    ['1.125rem',{ lineHeight: '1.8'                              }],
        'small':   ['0.875rem',{ lineHeight: '1.5'                              }],
        'label':   ['0.75rem', { lineHeight: '1',    letterSpacing: '0.08em'   }],
      },
      maxWidth: {
        'article': '720px',
        'site':    '1100px',
      },
    },
  },
  plugins: [],
};
