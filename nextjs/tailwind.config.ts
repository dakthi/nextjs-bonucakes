import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#083121',
        secondary: '#fcc56c',
        muted: '#4a5c52',
        light: '#f8faf9',
        white: '#ffffff',
        'gold-light-50': '#fef3d6',
        'gold-light-70': '#fefaed',
        success: '#10B981',
        disabled: '#CBD5E1',
      },
      fontFamily: {
        sans: ['var(--font-nunito-sans)', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['var(--font-nunito-sans)', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(8, 49, 33, 0.05)',
        md: '0 2px 8px rgba(8, 49, 33, 0.08)',
        lg: '0 4px 16px rgba(8, 49, 33, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
