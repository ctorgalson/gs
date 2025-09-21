import { defineConfig } from "vite"
import preact from "@preact/preset-vite"

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: "src/assets/vite",
    rollupOptions: {
      input: [
        "src/_includes/components/GridSettingsFieldset.jsx",
        "src/_includes/components/GridSettingsForm.jsx",
        "src/_includes/components/GridSystem.jsx",
        "src/_includes/components/HelloWorld.jsx",
        "node_modules/prismjs/themes/prism-okaidia.min.css",
      ],
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: "css/[name].[ext]",
      }
    }
  }
})
