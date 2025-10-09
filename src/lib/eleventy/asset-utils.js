import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { config } from "../../../.eleventy.js";

/**
 * Builds an <script> or <link> tag with optional SRI integrity attribute.
 *
 * @param {string} tagName
 *   Either "link" or "script".
 * @param {string} url
 *   The URL for the href/src attribute.
 * @param {string|null} integrity
 *   SRI integrity hash, or null if not available.
 *
 * @returns {string}
 *   Complete HTML tag string.
 */
export function buildTag(tagName, url, integrity) {
  const integrityAttr = integrity ? ` integrity="${integrity}"` : "";
  let tag;

  switch (tagName) {
    case "link":
      tag = `<link rel="stylesheet" href="${url}"${integrityAttr} />`;
      break;

    case "script":
      tag = `<script src="${url}"${integrityAttr}></script>`;
      break;

    default:
  }

  return tag;
}

/**
 * Builds asset paths and URL for an Eleventy asset.
 *
 * @param {string} assetPath
 *   Relative path to the asset file.
 *
 * @returns {Object}
 *   Object with fullPath (string) and url (string).
 */
export function getAssetUrl(assetPath) {
  // Vars from Eleventy config.
  const {
    assetDir,
    dir: { input: inputDir },
    viteDir,
  } = config;
  // Output path relative to project root.
  const outputPath = join(assetDir, assetPath);
  // Vite output path relative to project input dir.
  const vitePath = join(viteDir, assetPath);

  return {
    fullPath: join(process.cwd(), inputDir, vitePath),
    url: join("/", outputPath),
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

/**
 * Reads the current manifest from disk.
 *
 * @returns {Object}
 *   Parsed manifest object.
 */
export function getViteManifest() {
  return JSON.parse(readFileSync(config.manifestPath, "utf8"));
}
