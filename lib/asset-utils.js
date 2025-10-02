import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

/**
 * Builds asset paths and URL for an Eleventy asset.
 *
 * @param {Object} eleventyConfig
 *   eleventyConfig file used for accessing filters and configuration.
 * @param {string} assetPath
 *   Relative path to the asset file.
 * @param {string} assetDir
 *   Asset directory name.
 * @param {string} viteDir
 *   Vite directory path.
 *
 * @returns {Object}
 *   Object with fullPath (string) and url (string).
 */
export function getAssetUrl(eleventyConfig, assetPath, assetDir, viteDir) {
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
export function getIntegrityHash(fullPath, algorithm = "sha384") {
  let content, hash;

  if (existsSync(fullPath)) {
    content = readFileSync(fullPath);
    hash = `${algorithm}-${createHash(algorithm).update(content).digest("base64")}`;
  }

  return hash;
}