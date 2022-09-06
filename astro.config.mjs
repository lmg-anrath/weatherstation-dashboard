import { defineConfig } from 'astro/config';

import vue from "@astrojs/vue";
import deno from '@astrojs/deno';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node(),
  integrations: [vue()]
});