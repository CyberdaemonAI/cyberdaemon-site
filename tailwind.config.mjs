/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds — warm dark, not cold black
        bg:       '#111210',
        canvas:   '#111210',
        surface:  '#1a1917',
        border:   '#2e2c29',
        // Text — semantic tokens
        'text-primary':   '#e8e5de',
        'text-secondary': '#b0ada6',
        'text-muted':     '#706e68',
        'text-dim':       '#4a4842',
        // Text — legacy aliases
        'ink':         '#e8e5de',
        'ink-2':       '#b0ada6',
        'ink-muted':   '#706e68',
        // Accents — teal + gold + purple (matching cyberdaemon.ai)
        accent:        '#00c8a0',
        teal:          '#00c8a0',
        'teal-dim':    '#007a60',
        gold:          '#c9a84c',
        'gold-dim':    '#8a6400',
        purple:        '#9b8ecf',
        'purple-dim':  '#6b5fa0',
        critical:      '#c1121f',
        'critical-dim':'#8a0d16',
        // Lane accents
        'lane-research':  '#00c8a0',
        'lane-analysis':  '#c9a84c',
        'lane-buildlog':  '#9b8ecf',
        // Code
        'code-bg':    '#21201e',
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
