import { join } from "path";
import { createAssetShortcodes } from "./lib/shortcodes.js";

const assetDir = "assets";
const viteDir = join(assetDir, "vite");
const manifestPath = "src/assets/vite/.vite/manifest.json";

export default async function (eleventyConfig) {
  // Add throttle to prevent race conditions with Vite builds.
  eleventyConfig.setWatchThrottleWaitTime(200);

  // Watch for changes.
  [
    "src/_includes/assets/vite/.vite/manifest.json",
    "src/_includes/data/",
    "src/_includes/layouts/",
    "src/index.liquid",
  ].forEach((target) => eleventyConfig.addWatchTarget(target));

  // Copy static assets from Vite build.
  eleventyConfig.addPassthroughCopy({
    "src/assets/vite/css": `${assetDir}/css`,
    "src/assets/vite/js": `${assetDir}/js`,
  });

  // Add asset shortcodes.
  const { link, script } = createAssetShortcodes(manifestPath, assetDir, viteDir);
  eleventyConfig.addShortcode("link", link);
  eleventyConfig.addShortcode("script", script);
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
  },
  htmlTemplateEngine: "liquid",
  markdownTemplateEngine: "liquid",
  pathPrefix: "/gs/",
  templateFormats: ["liquid", "md", "html"],
};
