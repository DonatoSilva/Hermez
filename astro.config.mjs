// @ts-check
import { defineConfig, envField } from 'astro/config';
import clerk from "@clerk/astro";
import { esES } from '@clerk/localizations'

import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import icon from 'astro-icon';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      CLERK_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      CLERK_WEBHOOK_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      ID_ORG_DOMICILIARY: envField.string({
        context: "server",
        access: "public",
      }),
      ID_ORG_CLIENT: envField.string({
        context: "server",
        access: "public",
      })
    }
  },
  integrations: [clerk({
    localization: esES,
  }), react(), icon(), db()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['.ngrok-free.app'],
    }
  },
  output: 'server',
  adapter: vercel()
});