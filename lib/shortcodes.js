import { readFileSync } from "fs";
import { getAssetUrl, getIntegrityHash } from "./asset-utils.js";

/**
 * Creates shortcode functions for asset management.
 *
 * @param {string} manifestPath
 *   Path to the Vite manifest JSON file.
 * @param {string} assetDir
 *   Asset directory name.
 * @param {string} viteDir
 *   Vite directory path.
 *
 * @returns {Object}
 *   Object containing shortcode functions.
 */
export function createAssetShortcodes(manifestPath, assetDir, viteDir) {
  /**
   * Reads the current manifest from disk.
   *
   * @returns {Object}
   *   Parsed manifest object.
   */
  function getManifest() {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  }

  /**
   * Generates stylesheet link tags from Vite manifest with SRI integrity attrs.
   *
   * @param {string} filePath
   *   Path key in the Vite manifest.
   *
   * @returns {string}
   *   HTML link tags joined by newlines.
   */
  function link(filePath) {
    const manifest = getManifest();
    const links = [];
    const files = manifest[filePath].css;

    files.forEach((path) => {
      const { fullPath, url } = getAssetUrl(this, path, assetDir, viteDir);
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
  }

  /**
   * Generates a script tag with an SRI integrity attr.
   *
   * @param {string} filePath
   *   Path key in the Vite manifest.
   *
   * @returns {string}
   *   HTML script tag.
   */
  function script(filePath) {
    const manifest = getManifest();
    const { fullPath, url } = getAssetUrl(
      this,
      manifest[filePath].file,
      assetDir,
      viteDir,
    );
    const integrity = getIntegrityHash(fullPath);
    let script;

    if (integrity) {
      script = `<script src="${url}" integrity="${integrity}"></script>`;
    } else {
      script = `<script src="${url}"></script>`;
    }

    return script;
  }

  return { link, script };
}