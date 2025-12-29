
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta a variável de ambiente do sistema/Vercel no código do frontend
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
