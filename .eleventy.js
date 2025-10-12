import { join } from "path";
import { linksFromManifest, scriptFromManifest } from "./src/lib/eleventy/shortcodes.js";

const targets = [
  "src/_data/",
  "src/_includes/layouts/",
  "src/index.liquid",
];
const passthroughs = {
  "src/assets/favicons": "assets/favicons",
  "src/assets/fonts": "assets/fonts",
  "src/assets/vite/css": "assets/css",
  "src/assets/vite/js":  "assets/js",
  "src/robots.txt": "robots.txt",
  "src/humans.txt": "humans.txt",
};

export default async function (eleventyConfig) {
  // We need to pass the odd filter to shortcodes etc.
  const urlFilter = eleventyConfig.getFilter("url");

  // Add throttle to prevent race conditions with Vite builds.
  eleventyConfig.setWatchThrottleWaitTime(200);

  // Watch for changes.
  targets.forEach((target) => eleventyConfig.addWatchTarget(target));

  // Copy static assets from Vite build.
  eleventyConfig.addPassthroughCopy(passthroughs);

  // Add asset shortcodes.
  eleventyConfig.addShortcode("linksFromManifest", function (path) {
    return linksFromManifest.call(this, path, urlFilter);
  });
  eleventyConfig.addShortcode("scriptFromManifest", function (path) {
    return scriptFromManifest.call(this, path, urlFilter);
  });
}

export const config = {
  dir: {
    includes: "_includes",
    input: "src",
    output: "_site",
  },
  htmlTemplateEngine: "liquid",
  manifestPath: "src/assets/vite/.vite/manifest.json",
  markdownTemplateEngine: "liquid",
  templateFormats: ["liquid", "md", "html"],
  // Non-eleventy config used in shortcodes.
  assetDir: "assets",
  viteDir: join("assets", "vite"),
};
