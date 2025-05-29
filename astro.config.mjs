// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";
import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), tailwind(), react(), icon()],
  output: 'server',
  adapter: vercel()
});