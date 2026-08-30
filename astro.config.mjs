// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://jessegerlach.com",
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema: {
      WEB3FORMS_ACCESS_KEY: envField.string({ context: "client", access: "public", optional: true }),
    }
  }
});