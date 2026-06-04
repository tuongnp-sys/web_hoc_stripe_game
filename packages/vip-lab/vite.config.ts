import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/vip-lab/",
  build: {
    outDir: path.resolve(__dirname, "../../apps/web/public/vip-lab"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    cors: true,
  },
});
