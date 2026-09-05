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
          cyan: "#ffffff",
          violet: "#5b5dff"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(142, 161, 172, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
