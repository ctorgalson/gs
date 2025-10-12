import { useContext } from "preact/hooks";
import clsx from "clsx/lite";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import { computeCsSelector } from "../lib/grid/gridCssTemplate";

/**
 * Displays a fraction as a superscript numerator and subscript denominator.
 *
 * @param {Object} props
 *   Component props.
 * @param {number} props.numerator
 *   The numerator value.
 * @param {number} props.denominator
 *   The denominator value.
 *
 * @returns {JSX.Element}
 *   The formatted fraction.
 */
function Fraction({ numerator, denominator }) {
  return (
    <>
      <sup>{numerator}</sup> / <sub>{denominator}</sub>
    </>
  );
}

/**
 * Renders a demo of centered cells.
 *
 * Displays rows showing all possible column span combinations that add up to
 * the total column count. Each cell shows its span as a fraction of total columns.
 *
 * @param {Object} props
 *   Component props.
 * @param {string} [props.className]
 *   Optional CSS class for the container.
 * @param {JSX.Element} [props.heading]
 *   Optional heading element to display above the demo.
 *
 * @returns {JSX.Element}
 *   The column-spanning cells demo.
 */
export default function GridSystemCenteredCells({ className, heading }) {
  const { state } = useContext(GridSystemContext);
  const { columns, namespace } = state;

  return (
    <ErrorBoundary>
      <div className={clsx(className)}>
        {heading}
        <div tabindex="0">
          {Array.from({ length: columns - 3 }, (_, index) => {
            const span = index + 1;
            const selector = computeCsSelector(namespace, span, false);

            return (
              <div className={namespace}>
                <div className={clsx(selector, "gs__ac")}>
                  <Fraction numerator={span} denominator={columns} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
