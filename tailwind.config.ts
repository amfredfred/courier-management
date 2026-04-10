import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        brand: {
          50: "#fff8e7",
          100: "#ffedb8",
          200: "#ffe08a",
          300: "#ffd35b",
          400: "#ffc52d",
          500: "#f5a800",
          600: "#c27f00",
          700: "#8f5a00",
          800: "#5c3800",
          900: "#2a1800",
        },
      },
    },
  },
  plugins: [],
};

export default config;
