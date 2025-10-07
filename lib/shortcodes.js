import {
  buildTag,
  getAssetUrl,
  getIntegrityHash,
  getViteManifest,
} from "./asset-utils.js";

/**
 * Generates stylesheet link tags from Vite manifest with SRI integrity attrs.
 *
 * @param {string} filePath
 *   Path key in the Vite manifest.
 * @param {Object} urlFilter
 *   Eleventy's |url filter.
 *
 * @returns {string}
 *   HTML link tags joined by newlines.
 */
export function linksFromManifest(filePath, urlFilter) {
  const manifest = getViteManifest();
  const { css: assetPaths } = manifest[filePath];
  const links = assetPaths.map((assetPath) => {
    const { fullPath, url } = getAssetUrl(assetPath);
    const integrity = getIntegrityHash(fullPath);

    return buildTag("link", urlFilter(url), integrity);
  });

  return links.join("\n");
}

/**
 * Generates a script tag with an SRI integrity attr.
 *
 * @param {string} filePath
 *   Path key in the Vite manifest.
 * @param {Object} urlFilter
 *   Eleventy's |url filter.
 *
 * @returns {string}
 *   HTML script tag.
 */
export function scriptFromManifest(filePath, urlFilter) {
  const manifest = getViteManifest();
  const { file: assetPath } = manifest[filePath];
  const { fullPath, url } = getAssetUrl(assetPath);
  const integrity = getIntegrityHash(fullPath);

  return buildTag("script", urlFilter(url), integrity);
}
