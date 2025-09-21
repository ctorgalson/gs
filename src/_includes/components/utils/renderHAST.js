import { h } from "preact";

/**
 * Renders a HAST node into a corresponding HTML representation.
 *
 * @param {Object} node
 *   The HAST node to render.
 * @param {string} node.type
 *   The type of the node, "text", "element", or "root".
 * @param {string} [node.value]
 *   The text value of the node, if the type is "text".
 * @param {string} node.tagName
 *   The tag name of the element, if the type is "element".
 * @param {Object} [node.properties]
 *   The properties of the element, if the type is "element".
 * @param {Array<string>} [node.properties.className]
 *   The class names for the element, to (space) concatenate.
 * @param {Array<Object>} [node.children]
 *   The child nodes of the element, if the type is "element" or "root".
 * @returns {string|Array<string>|null}
 *   The rendered HTML string for "text" nodes, an array of rendered
 *
 * @see https://github.com/syntax-tree/hast
 */
export default function renderHAST(node) {
  let result;

  switch (node.type) {
    case "text":
      result = node.value;
      break;

    case "element": {
      const { tagName, properties = {}, children = [] } = node;

      if (Array.isArray(properties?.className)) {
        properties.className = properties.className.join(" ");
      }

      result = h(tagName, properties, children.map(renderHAST));
      break;
    }

    case "root":
      result = node.children.map(renderHAST);
      break;

    default:
      result = null;
  }

  return result;
}

