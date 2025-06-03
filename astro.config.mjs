// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";
import { esES } from '@clerk/localizations'

import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import icon from 'astro-icon';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({
    localization: esES,
  }), react(), icon(), db()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel()
});