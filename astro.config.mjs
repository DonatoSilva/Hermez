// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";

import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), react(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel()
});