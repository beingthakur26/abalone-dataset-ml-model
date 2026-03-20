import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to Flask during local development
    // so you don't get CORS issues
    proxy: {
      "/predict": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
