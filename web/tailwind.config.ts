import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f4e79",
          soft: "#e7effa",
        },
      },
    },
  },
  plugins: [],
};

export default config;
