import { useContext } from "preact/hooks";
import clsx from "clsx/lite";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import Fraction from "./Fraction";
import { computeEcSelector } from "../lib/grid/gridCssTemplate";

/**
 * Renders a demo of equal-width column cells.
 *
 * Displays rows of equal-width cells for each factor of the grid's column count.
 * Each cell shows its position as a fraction of the total columns.
 *
 * @param {Object} props
 *   Component props.
 * @param {string} [props.className]
 *   Optional CSS class for the container.
 * @param {JSX.Element} [props.heading]
 *   Optional heading element to display above the demo.
 *
 * @returns {JSX.Element}
 *   The equal-column cells demo.
 */
export default function GridSystemEqualColumnCells({ className, heading }) {
  const { factors, state } = useContext(GridSystemContext);
  const { namespace } = state;

  return (
    <ErrorBoundary>
      <div className={clsx(className)}>
        {heading}
        <div tabindex="0">
          {factors.map((factor) => (
            <div
              className={clsx(
                namespace,
                computeEcSelector(namespace, factor, false),
              )}
            >
              {Array.from({length: factor}, (_, index) => (
                <div><Fraction numerator={index + 1} denominator={factor} /></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
