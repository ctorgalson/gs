import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import manifest from "./src/assets/vite/.vite/manifest.json" with { type: "json" };

/**
 * Builds asset paths and URL for an Eleventy asset.
 *
 * @param {Object} eleventyConfig
 *   eleventyConfig file used for accessing filters and configuration.
 * @param {string} assetPath
 *   Relative path to the asset file.
 *
 * @returns {Object}
 *   Object with fullPath (string) and url (string).
 */
function getAssetUrl(eleventyConfig, assetPath) {
  // Output path relative to project root.
  const outputPath = join(assetDir, assetPath);
  // Vite output path relative to project input dir.
  const vitePath = join(viteDir, assetPath);
  // Eleventy URL filter.
  const urlFilter = eleventyConfig.getFilter("url");

  return {
    fullPath: join(process.cwd(), eleventyConfig.dir.input, vitePath),
    url: urlFilter(join("/", outputPath)),
  };
}

/**
 * Generates an SRI integrity hash for a file.
 *
 * @param {string} fullPath
 *   Absolute path to the file.
 * @param {string} [algorithm="sha384"]
 *   Hash algorithm to use (e.g., "sha256", "sha384", "sha512").
 *
 * @returns {string}
 *   Integrity hash string in the format "algorithm-base64hash".
 */
function getIntegrityHash(fullPath, algorithm = "sha384") {
  let content, hash;

  if (existsSync(fullPath)) {
    content = readFileSync(fullPath);
    hash = `${algorithm}-${createHash(algorithm).update(content).digest("base64")}`;
  }

  return hash;
}

const assetDir = "assets";
const viteDir = join(assetDir, "vite");

export default async function (eleventyConfig) {
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

  /**
   * Generates stylesheet link tags from Vite manifest with SRI integrity attrs.
   *
   * @param {string} filePath
   *   Path key in the Vite manifest.
   *
   * @returns {string}
   *   HTML link tags joined by newlines.
   */
  eleventyConfig.addShortcode("link", function (filePath) {
    const links = [];
    const files = manifest[filePath].css;

    files.forEach((path) => {
      const { fullPath, url } = getAssetUrl(eleventyConfig, path);
      const integrity = getIntegrityHash(fullPath);
      let link;

      if (integrity) {
        link = `<link rel="stylesheet" href="${url}" integrity="${integrity}" />`;
      } else {
        link = `<link rel="stylesheet" href="${url}" />`;
      }

      links.push(link);
    });

    return links.join("\n");
  });

  /**
   * Generates a script tag with an SRI integrity attr.
   *
   * @param {string} filePath
   *   Path key in the Vite manifest.
   *
   * @returns {string}
   *   HTML script tag.
   */
  eleventyConfig.addShortcode("script", function (filePath) {
    const { fullPath, url } = getAssetUrl(
      eleventyConfig,
      manifest[filePath].file,
    );
    const integrity = getIntegrityHash(fullPath);
    let script;

    if (integrity) {
      script = `<script src="${url}" integrity="${integrity}"></script>`;
    } else {
      script = `<script src="${url}"></script>`;
    }

    return script;
  });
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
