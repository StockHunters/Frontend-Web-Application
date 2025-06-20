import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import {createAppBase} from "./src/shared/utils/globals/app.config.js";
const env = loadEnv('', process.cwd());

export default defineConfig({
  base: createAppBase(env),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@globals': path.resolve(__dirname, './src/shared/utils/globals'),
    },
  },
});