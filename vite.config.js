import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    manifest: true,
    outDir: "src/assets/vite",
    rollupOptions: {
      input: ["src/_includes/components/GridSystem.jsx"],
      output: {
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: "css/[name]-[hash].[ext]",
      },
    },
  },
});
