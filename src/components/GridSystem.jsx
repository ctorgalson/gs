import { useEffect, useRef, useState } from "preact/hooks";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import GridSettingsForm from "./GridSettingsForm";
import GridStylesheet from "./GridStylesheet";
import GridSystemEqualColumnCells from "./GridSystemEqualColumnCells";
import GridSystemColumnSpanCells from "./GridSystemColumnSpanCells";
import Code from "./Code";
import factorizeColumnCount from "../lib/grid/factorizeColumnCount";
import { gridCssTemplate } from "../lib/grid/gridCssTemplate";
import "water.css/out/water.min.css";
import "../assets/css/styles.css";

export default function GridSystem({ readOnly = {}, defaultState }) {
  const [state, setState] = useState(() => ({
    ...defaultState,
    ...Object.fromEntries(new URLSearchParams(window.location.search)),
    ...readOnly,
  }));
  const [gridCss, setGridCss] = useState(undefined);
  const [factors, setFactors] = useState(undefined);
  const firstRender = useRef(true);

  useEffect(() => {
    const factors = factorizeColumnCount(state.columns);
    const gridCss = gridCssTemplate(state, factors);
    let urlParams;
    let newUrl;

    setFactors(factors);
    setGridCss(gridCss);

    if (firstRender.current) {
      firstRender.current = false;
    } else {
      urlParams = new URLSearchParams(state);
      newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
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
        <GridStylesheet />
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

        <GridSystemEqualColumnCells
          className="gs__html-demo"
          heading={<h2>Equal-width cells</h2>}
        />

        <GridSystemColumnSpanCells
          className="gs__html-demo"
          heading={<h2>Column-spanning cells</h2>}
        />
      </ErrorBoundary>
    </GridSystemContext.Provider>
  ) : null;
}
