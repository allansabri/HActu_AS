import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        max: {
          black: "#02040a",
          ink: "#070b16",
          panel: "#0b1020",
          line: "#1a2440",
          blue: "#8EA1AC",
          cyan: "#00c4cc",
          violet: "#5b5dff"
        }
      },
      fontFamily: {
        sans: ['"Max Sans"', "var(--font-max-sans)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
        max: ['"Max Sans"', "var(--font-max-sans)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(142, 161, 172, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
