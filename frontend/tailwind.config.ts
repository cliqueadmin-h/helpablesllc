import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2ECC71",
          dark: "#27AE60",
          light: "#58D68D",
        },
        secondary: {
          DEFAULT: "#00B8D9",
          dark: "#0097B2",
          light: "#33C9E6",
        },
        dark: {
          DEFAULT: "#1A1A1A",
          light: "#2D2D2D",
        },
        light: {
          DEFAULT: "#F8F9FA",
          gray: "#E9ECEF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
