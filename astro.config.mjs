import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'

import sitemap from '@astrojs/sitemap'

// Tailwind 3 se carga vía PostCSS (postcss.config.cjs). La integración
// @astrojs/tailwind está deprecada y no declara soporte para Astro 7.

// https://astro.build/config
export default defineConfig({
  site: 'https://franmoreno.com/',
  integrations: [react(), mdx(), sitemap()]
})
