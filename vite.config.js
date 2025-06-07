import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { __appBase } from "./src/shared/utils/globals/app.config.js";

export default defineConfig({
  base: __appBase,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@globals': path.resolve(__dirname, './src/shared/utils/globals'),
    },
  },
});