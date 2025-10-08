import dedent from "dedent";

const columnsMultiplier = 2;

/**
 * Generates a formatted string of CSS selectors, with options for indentation
 * and line wrapping.
 *
 * @param {Array<Object>} selectors
 *   An array of selector objects.
 * @param {string} selectors[].selector
 *   The CSS selector as a string.
 * @param {number} [maxSelectorsPerLine=1]
 *   The maximum number of selectors to include on a single line. Defaults to 1.
 * @param {boolean} [indentMultiline=false]
 *   Whether to indent multiline selectors.
 * @param {boolean} [newLineWrap=false]
 *   Whether to add a new line before the first selector and after the last.
 *   Works with indentMultiline for use inside e.g. :where().
 * @returns {string}
 *   A formatted string of selectors, separated by commas and new lines based
 *   on the specified limits.
 */
function selectorList(
  selectors,
  maxSelectorsPerLine = 1,
  indentMultiline = false,
  newLineWrap = false,
) {
  if (selectors.length === 0) {
    return "";
  }

  const lines = Math.ceil(selectors.length / maxSelectorsPerLine);
  const result = [];

  selectors.forEach((selector, index) => {
    const newLine = index % maxSelectorsPerLine === 0;
    const indent = lines > 1 && indentMultiline ? "  " : "";
    let prefix = "";
    let suffix = "";

    if (index === 0) {
      prefix = `${newLineWrap && lines > 1 ? "\n" : ""}${indent}`;
    } else {
      prefix = newLine ? `,\n${indent}` : ", ";

      if (index === selectors.length - 1 && newLineWrap && lines > 1) {
        suffix = "\n";
      }
    }

    result.push(`${prefix}${selector.selector}${suffix}`);
  });

  return result.join("");
}

/**
 * Computes a CSS selector for equal-column grid cells.
 *
 * @param {string} namespace
 *   The namespace to use when constructing the selector.
 * @param {number} factor
 *   The factor used to determine column span (columnsActual / factor).
 * @param {boolean} [selector=true]
 *   Whether to include the CSS selector prefix (.).
 *
 * @returns {string}
 *   The computed CSS selector.
 */
export function computeEcSelector(namespace, factor, selector = true) {
  return `${selector ? "." : ""}${namespace}--ec${factor}`;
}

/**
 * Creates a list of selectors for equal-column selectors.
 *
 * @param {number} columnsActual
 *   The actual number of desktop grid columns in use (not, i.e. the "public"
 *   number of columns in the design system).
 * @param {Array<number>} factors
 *   The factors, excluding 1, of the "public" number of desktop columns in the
 *   design system.
 * @param {string} namespace
 *   The namespace to use when constructing the selector.
 * @return {Array<string>}
 *   The set of computed selectors.
 */
export function computeEcSelectors(columnsActual, factors, namespace) {
  return factors.map((factor) => ({
    selector: computeEcSelector(namespace, factor),
    span: columnsActual / factor,
  }));
}

/**
 * Computes a CSS selector for column-span grid cells.
 *
 * @param {string} namespace
 *   The namespace to use when constructing the selector.
 * @param {number} span
 *   The number of columns the cell should span.
 * @param {boolean} [selector=true]
 *   Whether to include the CSS selector prefix (.).
 *
 * @returns {string}
 *   The computed CSS selector.
 */
export function computeCsSelector(namespace, span, selector = true) {
  return `${selector ? "." : ""}${namespace}__cs${span}`;
}

/**
 * Creates a list of selectors for column-span cells.
 *
 * @param {number} columns
 *   The "public" number of columns used in the design system.
 * @param {number} columnsMultiplier
 *   The number used to determine the actual columns in the CSS (by multiplying
 *   with columns elsewhere).
 * @param {string} namespace
 *   The namespace to use when constructing the selector.
 * @return {Array<string>} selectors
 *   The set of computed selectors.
 */
export function computeCsSelectors(
  columns,
  columnsMultiplier,
  namespace,
) {
  const selectors = [];

  for (let span = 1; span <= columns; span++) {
    selectors.push({
      selector: computeCsSelector(namespace, span),
      span: columnsMultiplier * span,
    });
  }

  return selectors;
}

/**
 * Generates CSS styles for a grid layout based on the provided settings.
 *
 * @param {Object} settings
 *   The settings for the grid CSS layout.
 * @param {string} settings.breakpointDesktop
 *   A valid CSS breakpoint value.
 * @param {string} settings.breakpointMobile
 *   A valid CSS breakpoint value.
 * @param {number} settings.columns
 *   The number of columns for desktop view.
 * @param {Array<string>} settings.csSelectors
 *   An array of CSS selectors for column-spanning cells (i.e. styles for cells
 *   that span an arbitrary number of grid columns).
 * @param {Array<string>} settings.ecSelectors
 *   An array of CSS selectors for equal-column cells (i.e. styles for cells
 *   that appear in a grid with equal-width columns).
 * @param {string} settings.namespace
 *   A string used to customize the selector and variable names. E.g. MyCompany
 *   might use `myco-gs` to get classes like `.myco-gs`, `.myco-gs__cs1` etc.,
 *   and variables like `--myco-gs-grid-column-span`.
 *
 * @returns {string} The generated CSS styles as a string.
 */
export function gridCssTemplate({
  breakpointDesktop,
  breakpointTablet,
  columnGapDesktop,
  columnGapTablet,
  columns,
  namespace,
  rowGapDesktop,
  rowGapMobile,
  rowGapTablet,
}, factors) {
  const columnsActual = columnsMultiplier * columns;
  const ecSelectors = computeEcSelectors(
    columnsActual,
    factors,
    namespace,
  );
  const csSelectors = computeCsSelectors(
    columns,
    columnsMultiplier,
    namespace,
  );

  return dedent.withOptions({ alignValues: true })`
    /**
     * BH Grid System
     *
     * This file contains a grid system using ${columns} columns.
     */
    .${namespace} {
      --${namespace}-grid-row-gap: ${rowGapMobile};
      --${namespace}-grid-columns: ${columns};
      --${namespace}-grid-columns-actual: calc(2 * var(--${namespace}-grid-columns));
      /* Everything has 1 column at mobile sizes. */
      --${namespace}-grid-column-span: calc(var(--${namespace}-grid-columns-actual) / 1);

      display: grid;
      grid-auto-rows: auto;
      grid-column-gap: var(--${namespace}-grid-column-gap);
      grid-row-gap: var(--${namespace}-grid-row-gap);
      grid-template-columns: repeat(var(--${namespace}-grid-columns-actual), 1fr);
    }

    :where(${selectorList(ecSelectors, 3, true, true)}) > *,
    ${selectorList(csSelectors, 3)} {
      grid-column: span var(--${namespace}-grid-column-span);
    }

    @media screen and (${breakpointTablet}) {
      .${namespace} {
        --${namespace}-grid-column-gap: ${columnGapTablet};
        --${namespace}-grid-row-gap: ${rowGapTablet};
        /* Everything has 2 columns at tablet sizes. */
        --${namespace}-grid-column-span: calc(var(--${namespace}-grid-columns-actual) / 2);
      }

      /* Align-center cells */
      .${namespace}__ac {
        --${namespace}-grid-column-start: calc(
          1 + (var(--${namespace}-grid-columns-actual) - var(--${namespace}-grid-column-span)) / 2
        );
      }

      /* Align-end cells */
      .${namespace}__ae {
        --${namespace}-grid-column-start: calc(
          1 + var(--${namespace}-grid-columns-actual) - var(--${namespace}-grid-column-span)
        );
      }

      /* Align-center, align-end common */
      .${namespace}__ac,
      .${namespace}__ae {
        grid-column: var(--${namespace}-grid-column-start) / span var(--${namespace}-grid-column-span);
      }
    }

    @media screen and (${breakpointDesktop}) {
      .${namespace} {
        --${namespace}-grid-column-gap: ${columnGapDesktop};
        --${namespace}-grid-row-gap: ${rowGapDesktop};
      }

      /* Equal-column cells */
      ${ecSelectors.map((s) => `${s.selector} > * { --${namespace}-grid-column-span: ${s.span}; }`).join("\n")}

      /* Column-spanning cells */
      ${csSelectors.map((s) => `${s.selector} { --${namespace}-grid-column-span: ${s.span}; }`).join("\n")}
    }
`;
}
