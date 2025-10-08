import { useContext, useEffect, useRef } from "preact/hooks";
import clsx from "clsx/lite";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import {
  computeEcSelector,
  computeCsSelector,
} from "./utils/gridCssTemplate";

export default function GridSystemDemo({
  className,
  demoHeading,
  columnSpanClassName,
  columnSpanHeading,
  equalColumnClassName,
  equalColumnHeading,
}) {
  return (
    <ErrorBoundary>
      <div className={className}>
        {demoHeading}
        <GridSystemStylesheet />
        <GridSystemEqualColumnCells
          className={equalColumnClassName}
          heading={equalColumnHeading}
        />
        <GridSystemColumnSpanCells
          className={columnSpanClassName}
          heading={columnSpanHeading}
        />
      </div>
    </ErrorBoundary>
  );
}

function GridSystemStylesheet() {
  const { gridCss } = useContext(GridSystemContext);
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement("style");
      document.head.appendChild(style);
      styleRef.current = style;
    }

    styleRef.current.textContent = gridCss;
  }, [gridCss]);
}

function GridSystemEqualColumnCells({ className, heading }) {
  const { factors, state } = useContext(GridSystemContext);
  const { namespace } = state;

  return (
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
  );
}

function GridSystemColumnSpanCells({ className, heading }) {
  const { state } = useContext(GridSystemContext);
  const { columns, namespace } = state;

  return (
    <div className={clsx(className)}>
      {heading}
      <div tabindex="0">
        {Array.from({ length: columns }, (_, index) => {
          const span1 = index + 1;
          const selector1 = computeCsSelector(namespace, span1, false);
          const span2 = parseInt(columns, 10) - span1;
          const selector2 = computeCsSelector(namespace, span2, false);

          return (
            <div className={namespace}>
              <div className={selector1}><Fraction numerator={span1} denominator={columns} /></div>
              {span2 ? (<div className={selector2}><Fraction numerator={span2} denominator={columns} /></div>) : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Fraction({ numerator, denominator }) {
  return (
    <>
      <sup>{numerator}</sup> / <sub>{denominator}</sub>
    </>
  );
}
