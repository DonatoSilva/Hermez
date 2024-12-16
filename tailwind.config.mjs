/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'H-black': '#0c1218',
				'H-blue-900': '#2b4055',
				'H-blue-700': '#496e93',
				'H-blue-500': '#82a1c1',
				'H-blue-300': '#bfcfdf',
				'H-blue-100': '#fdfdfe',
			},
		},
	},
	plugins: [],
}
