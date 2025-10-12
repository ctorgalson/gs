import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

/**
 * Compresses a state object into a URL-safe string
 *
 * @param {Object} state
 *   The state object to compress
 *
 * @returns {string}
 *   Compressed and URL-encoded string
 */
export function compressState(state) {
  return compressToEncodedURIComponent(JSON.stringify(state));
}

/**
 * Decompresses a URL-safe string back into a state object
 *
 * @param {string} compressed
 *   The compressed string from the URL
 *
 * @returns {Object|null}
 *   The decompressed state object, or null if decompression fails
 */
export function decompressState(compressed) {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
