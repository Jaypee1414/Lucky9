/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		inset: {
		  "40p": "40%", // Correct key format for Tailwind class naming
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
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
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
		backgroundImage: {
		  "Button-gradient": "linear-gradient(to bottom, #B4C5FB, #180CFF)",
		  "text-gradient": "linear-gradient(to right, #E88345, #AEAF6C)",
		  "user-name": "linear-gradient(to right, #DC2424, #999999)",
		  "rightBar-Button": "linear-gradient(to right, #EB4C3D, #1664AD)",
		  "deck-background": "linear-gradient(to bottom, #002838, #7AD2AF)",
		  "custom-gradient":
			"linear-gradient(to right, rgba(78,106,99, 1), rgba(6,100,167, 1), rgba(16,0,224, 0.04), rgba(16,0,224, 0.04), rgba(6,100,167, 1), rgba(78,106,99, 1))",
		  "header-gradient":
			"linear-gradient(to right, rgba(154, 208, 194, 0.8), rgba(112, 35, 28, 0.3))",
		  "bet-background": "linear-gradient(to right, #021821 0%, #954A4A 100%)",
		},
		textStroke: {
		  DEFAULT: "2px #201F17", // Default stroke color and width
		  thin: "1px black", // Thin stroke
		  thick: "1px black", // Thick stroke
		},
		fontFamily: {
		  jaro: ["Jaro", "sans-serif"],
		  robotoSans: ["Roboto", "sans-serif"],
		  jainiPurva: ["Jaini Purva", "sans-serif"],
		  sansita: ["'Sansita Swashed'", "sans-serif"],
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
	  },
	},
	plugins: [require("tailwindcss-animate"),
		function ({ addUtilities, theme, e }) {
			const textStrokeValues = theme('textStroke');
			const textStrokeUtilities = Object.keys(textStrokeValues).reduce((acc, key) => {
			  acc[`.${e(`text-stroke-${key}`)}`] = {
				'-webkit-text-stroke': textStrokeValues[key],
			  };
			  return acc;
			}, {});
	  
			addUtilities(textStrokeUtilities, ['responsive', 'hover']);
		  },
	],
  };
  