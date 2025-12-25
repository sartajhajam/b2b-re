import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0F172A", // Deep Navy
                accent: "#C9A24D",  // Antique Gold
                background: "#FAFAFA", // Off-white
                surface: "#FFFFFF",
                "text-main": "#1F2937", // Charcoal
                "text-muted": "#6B7280", // Slate
                border: "#E5E7EB", // Light Gray
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
                cute: ["var(--font-dancing)", "cursive"],
            },
        },
    },
    plugins: [],
};
export default config;
