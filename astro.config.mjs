// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://jessegerlach.com",

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [svelte()]
});