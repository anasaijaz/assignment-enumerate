/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          900: "hsl(var(--primary-900))",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: "hsl(var(--secondary-50))",
          100: "hsl(var(--secondary-100))",
          500: "hsl(var(--secondary-500))",
          600: "hsl(var(--secondary-600))",
          900: "hsl(var(--secondary-900))",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      spacing: {
        0.5: "0.125rem", // 2px
        1.5: "0.375rem", // 6px
        2.5: "0.625rem", // 10px
        3.5: "0.875rem", // 14px
        7: "1.75rem", // 28px
        9: "2.25rem", // 36px
      },
      fontSize: {
        h1: [
          "2.25rem",
          {
            lineHeight: "2.5rem",
            letterSpacing: "-0.025em",
            fontWeight: "800",
          },
        ],
        h2: [
          "1.875rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.025em",
            fontWeight: "700",
          },
        ],
        h3: [
          "1.5rem",
          { lineHeight: "2rem", letterSpacing: "0", fontWeight: "600" },
        ],
        h4: [
          "1.25rem",
          { lineHeight: "1.75rem", letterSpacing: "0", fontWeight: "600" },
        ],
        "body-large": [
          "1.125rem",
          { lineHeight: "1.75rem", fontWeight: "400" },
        ],
        body: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
        "body-small": [
          "0.875rem",
          { lineHeight: "1.25rem", fontWeight: "400" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.025em", fontWeight: "400" },
        ],
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
        "label-small": [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.025em", fontWeight: "500" },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
