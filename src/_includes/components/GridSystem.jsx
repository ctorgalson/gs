import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import GridSettingsForm from "./GridSettingsForm";
import GridSystemDemo from "./GridSystemDemo";
import Code from "./Code";
import factorizeColumnCount from "./utils/factorizeColumnCount";
import { gridCssTemplate } from "./utils/gridCssTemplate";
import "water.css/out/water.min.css";
import "../../assets/css/styles.css";

function GridSystem({
  readOnly = {},
  defaultState = {
    namespace: "gs",
    breakpointDesktop: "width >= 60rem",
    breakpointTablet: "width >= 48rem",
    columnGapDesktop: "var(--column-gap-desktop, 1.5rem)",
    columnGapTablet: "var(--column-gap-tablet, 1.125rem)",
    rowGapDesktop: "var(--row-gap-desktop, 1.5lh)",
    rowGapMobile: "var(--row-gap-mobile, 1lh)",
    rowGapTablet: "var(--row-gap-tablet, 0.75lh)",
    columns: 12,
  },
}) {
  const [state, setState] = useState(() => ({
    ...defaultState,
    ...Object.fromEntries(new URLSearchParams(window.location.search)),
    ...readOnly,
  }));
  const [gridCss, setGridCss] = useState(undefined);
  const [factors, setFactors] = useState(undefined);

  useEffect(() => {
    const urlParams = new URLSearchParams(state);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    const factors = factorizeColumnCount(state.columns);
    const gridCss = gridCssTemplate(state, factors);

    setFactors(factors);
    setGridCss(gridCss);
    window.history.replaceState({}, "", newUrl);
  }, [state]);

  return gridCss ? (
    <GridSystemContext.Provider
      value={{
        factors,
        gridCss,
        readOnly,
        state,
        setState,
      }}
    >
      <ErrorBoundary>
        <GridSettingsForm />
        <Code
          className="gs__css"
          code={gridCss}
          downloadFilename={`grid--${state.namespace}-${state.columns}.css`}
          downloadLinkText="Download code"
          downloadMimeType="text/css"
          heading={<h2>Generated CSS</h2>}
          language="css"
        />
        <GridSystemDemo
          classname="gs__html"
          equalColumnClassName="gs__html-demo"
          equalColumnHeading={<h2>Equal-width cells</h2>}
          columnSpanClassName="gs__html-demo"
          columnSpanHeading={<h2>Column-spanning cells</h2>}
          stylesheetIdSelector="#grid-system-styles"
        />
      </ErrorBoundary>
    </GridSystemContext.Provider>
  ) : null;
}

document
  .querySelectorAll("[data-component='grid-system']")
  .forEach((el) => render(<GridSystem />, el));
