import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:3001" } // dev: forward to your server
  },
  build: {
    outDir: "../server/client_dist", // prod: build into server/client_dist
    emptyOutDir: true
  }
});
