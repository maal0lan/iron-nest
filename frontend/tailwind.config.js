/** @type {import('tailwindcss').Config} */
// Tailwind is wired to the design tokens in src/styles/tokens.css so that
// utilities and themes stay in sync. Components should keep using var(--token).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { container: false }, // `.container` is defined in src/styles/index.css
  theme: {
    // Breakpoints from the staff design system: 640 · 768 · 1024 · 1280
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)'],
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: { DEFAULT: '150ms' },
      transitionTimingFunction: { DEFAULT: 'ease-out' },
      keyframes: {
        'fade-up': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
        'pop-in': { from: { opacity: 0, transform: 'translateY(-8px) scale(.96)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .4s ease-out both',
        marquee: 'marquee 32s linear infinite',
        'pop-in': 'pop-in .18s ease-out both',
      },
    },
  },
  plugins: [],
};
