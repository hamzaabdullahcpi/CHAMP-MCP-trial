import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    base: './',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
      'process.env.AIRTABLE_BASE_ID': JSON.stringify(process.env.AIRTABLE_BASE_ID || env.AIRTABLE_BASE_ID || env.VITE_AIRTABLE_BASE_ID || ''),
      'process.env.AIRTABLE_PAT': JSON.stringify(process.env.AIRTABLE_PAT || env.AIRTABLE_PAT || env.VITE_AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || env.AIRTABLE_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
