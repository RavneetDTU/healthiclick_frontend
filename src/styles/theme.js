// styles/theme.js
/** @type {import('tailwindcss').Config['theme']} */
export const theme = {
    extend: {
      colors: {
        primary: "#4A90E2",
        secondary: "#20B2AA",
        accent: "#A78BFA",
        background: "#F9FAFB",
        muted: "#E5E7EB",
        textPrimary: "#1F2937",
        textSecondary: "#4B5563",
        error: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["'Nunito Sans'", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.05)",
        card: "0 2px 10px rgba(74, 144, 226, 0.1)",
      },
    },
  }
  