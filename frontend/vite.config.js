import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api/resend': {
        target: 'https://api.resend.com/emails',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/resend/, '')
      }
    }
  },
});
