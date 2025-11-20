import icon from 'astro-icon'
// @ts-check
import clerk from "@clerk/astro"
import { esES } from '@clerk/localizations'
import { defineConfig, envField } from 'astro/config'

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

import tailwindcss from "@tailwindcss/vite"
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
      ,
      URL_LOCAL_BACKEND: envField.string({
        context: "client",
        access: "public",
      }),
      API_USERS: envField.string({
        context: "client",
        access: "public",
      }),
      API_ADDRESSES: envField.string({
        context: "client",
        access: "public",
      }),
      API_DELIVERY_REQUESTS: envField.string({
        context: "client",
        access: "public",
      }),
    }
  },
  integrations: [clerk({
    localization: esES,
  }), react(), icon()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@icons': '/src/assets/icons',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@pages': '/src/pages',
        '@styles': '/src/styles',
        '@scripts': '/src/scripts',
        '@stores': '/src/stores',
        '@types': '/src/types',
        '@actions': '/src/actions',
      },
    },
    server: {
      allowedHosts: ['.ngrok-free.app'],
    }
  },
  output: 'server',
  adapter: vercel()
})