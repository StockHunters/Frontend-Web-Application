import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const DEFAULT_BASE = '/';
const [org, repo] = process.env.GITHUB_REPOSITORY?.split('/') || [];
const base = process.env.VITE_BASE || (repo ? `/${repo}/` : DEFAULT_BASE);

export default defineConfig({
  base: base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});