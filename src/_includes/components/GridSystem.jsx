import { render } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { refractor } from "refractor";
import css from "refractor/css";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import GridSettingsForm from "./GridSettingsForm";
import renderHAST from "./utils/renderHAST";
import factorizeColumnCount from "./utils/factorizeColumnCount";
import {
  gridCssTemplate,
  computeEcSelector,
  computeCsSelector
} from "./utils/gridCssTemplate";
import "water.css/out/water.min.css";
import "prismjs/themes/prism-okaidia.min.css";
import "../../assets/css/styles.css";

function GridSystem({
  readOnly = { columnsMobile: 1, columnsTablet: 2 },
  defaultState = {
    namespace: "gs",
    breakpointDesktop: "width >= 60rem",
    breakpointTablet: "width >= 48rem",
    columnGapDesktop: "var(--column-gap-desktop, 1.5rem)",
    columnGapTablet: "var(--column-gap-tablet, 1.125rem)",
    rowGapDesktop: "var(--row-gap-desktop, 1.5lh)",
    rowGapMobile: "var(--row-gap-mobile, 1lh)",
    rowGapTablet: "var(--row-gap-tablet, 0.75lh)",
    columnsDesktop: 12,
  },
}) {
  const [state, setState] = useState(() => ({
    ...defaultState,
    ...Object.fromEntries(new URLSearchParams(window.location.search)),
    ...readOnly,
  }));
  const [gridCss, setGridCss] = useState(undefined);
  const [factors, setFactors] = useState(undefined);
  const styleRef = useRef(undefined);
  refractor.register(css);

  useEffect(() => {
    const urlParams = new URLSearchParams(state);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    const factors = factorizeColumnCount(state.columnsDesktop);
    const gridCss = gridCssTemplate(state, factors);

    setFactors(factors);
    setGridCss(gridCss);
    window.history.replaceState({}, "", newUrl);
  }, [state]);

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.querySelector("#grid-system-styles");
    }

    styleRef.current.textContent = gridCss;
  }, [gridCss]);

  return gridCss ? (
    <GridSystemContext.Provider value={{
      factors,
      gridCss,
      readOnly,
      state,
      setState
    }}>
      {
        <ErrorBoundary>
          <GridSettingsForm />
          <GridSettingsStyles />
          <GridSettingsGrids />
        </ErrorBoundary>
      }
    </GridSystemContext.Provider>
  ) : (
    <p>Loading...</p>
  );
}

function GridSettingsStyles() {
  const { gridCss, state } = useContext(GridSystemContext);
  const highlighted = refractor.highlight(gridCss, "css");

  return (
    <>
      {gridCss && highlighted ? (
        <>
          <h2>Generated CSS</h2>
          <pre className="gs__css language-css">
            <code className="language-css">{renderHAST(highlighted)}</code>
          </pre>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

function GridSettingsGrids() {
  const { factors, gridCss, state } = useContext(GridSystemContext);
  const { columnsDesktop, namespace } = state;
  console.log({ columnsDesktop, factors });

  return (
    <div class="gs__html">
      <h2>Generated CSS</h2>

      {/* Equal-column cells */}
      <h3>Equal-width cells</h3>
      {factors.map((factor) => (
        <div class={[
          namespace,
          computeEcSelector(namespace, factor, false),
          "gs__html-cell"
        ].join(" ")}>
          {Array.from({ length: factor }, (_, index) => (
            <div><sup>{index + 1}</sup> / <sub>{factor}</sub></div>
          ))}
        </div>
      ))}

      {/* Column-spanning cells */}
      <h3>Column-spanning cells</h3>
      <div class={namespace}>
        {Array.from({ length: columnsDesktop }, (_, index) => {
          const span1 = index + 1;
          const unit1 = span1 > 1 ? "cols" : "col";
          const selector1 = computeCsSelector(namespace, span1, false);
          const span2 = parseInt(columnsDesktop, 10) - span1;
          const unit2 = span2 > 1 ? "cols" : "col";
          const selector2 = computeCsSelector(namespace, span2, false);

          return (
            <>
              <div class={selector1}>{span1} {unit1}</div>
              {span2 ? (<div class={selector2}>{span2} {unit2}</div>) : ""}
            </>
          );
        })}
      </div>
    </div>
  );
}

document
  .querySelectorAll("[data-component='grid-system']")
  .forEach((el) => render(<GridSystem />, el));
