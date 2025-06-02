// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";

import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import icon from 'astro-icon';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), react(), icon(), db()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel()
});