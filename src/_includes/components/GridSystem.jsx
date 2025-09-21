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
  computeEcSelectors,
  computeCsSelectors,
  gridCssTemplate
} from "./utils/gridCssTemplate"
import "prismjs/themes/prism-okaidia.min.css?inline";

function GridSystem({
  columnsMobile = 1,
  columnsTablet = 2,
  columnsMultiplier = 2,
  defaults = {
    namespace: "gs",
    breakpointDesktop: "width >= 60rem",
    breakpointTablet: "width >= 48rem",
    columnsDesktop: 12,
  },
}) {
  const urlParams = new URLSearchParams(window.location.search);
  const [columnsDesktop, setColumnsDesktop] = useState(
    urlParams.get("columnsDesktop") || defaults.columnsDesktop,
  );
  const [breakpointDesktop, setBreakpointDesktop] = useState(
    urlParams.get("breakpointDesktop") || defaults.breakpointDesktop
  );
  const [breakpointTablet, setBreakpointTablet] = useState(
    urlParams.get("breakpointTablet") || defaults.breakpointTablet
  );
  const [namespace, setNamespace] = useState(urlParams.get("namespace") || defaults.namespace);
  const [columnsDesktopActual, setColumnsDesktopActual] = useState(undefined);
  const [factors, setFactors] = useState(undefined);
  const [ecSelectors, setEcSelectors] = useState(undefined);
  const [csSelectors, setCsSelectors] = useState(undefined);
  const [gridCss, setGridCss] = useState(undefined);
  const styleRef = useRef(undefined);
  refractor.register(css);

  useEffect(() => {
    const params = new URLSearchParams();
    let newUrl;

    params.set("breakpointDesktop", breakpointDesktop);
    params.set("breakpointTablet", breakpointTablet);
    params.set("columnsDesktop", columnsDesktop);
    params.set("namespace", namespace);
    newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [breakpointDesktop, breakpointTablet, columnsDesktop, namespace]);

  useEffect(() => {
    const factors = factorizeColumnCount(columnsDesktop);
    const columnsDesktopActual = columnsMultiplier * columnsDesktop;
    const ecSelectors = computeEcSelectors(columnsDesktopActual, factors, namespace);
    const csSelectors = computeCsSelectors(columnsDesktop, columnsMultiplier, namespace);

    setFactors(factors);
    setEcSelectors(ecSelectors);
    setCsSelectors(csSelectors);
    setColumnsDesktopActual(columnsDesktopActual);
    setGridCss(gridCssTemplate({
      breakpointDesktop,
      breakpointTablet,
      columnsDesktop,
      columnsMobile,
      columnsTablet,
      csSelectors,
      ecSelectors,
      namespace,
    }));
  }, [columnsDesktop, namespace]);

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.querySelector("#grid-system-styles");
    }

    styleRef.current.textContent = gridCss;
  }, [gridCss]);

  return (
    <GridSystemContext.Provider
      value={{
        breakpointDesktop,
        setBreakpointDesktop,
        breakpointTablet,
        setBreakpointTablet,
        columnsDesktop,
        setColumnsDesktop,
        csSelectors,
        setCsSelectors,
        ecSelectors,
        setEcSelectors,
        factors,
        setFactors,
        columnsMobile,
        columnsTablet,
        namespace,
        gridCss,
      }}
    >
      {gridCss ? (
        <ErrorBoundary>
          <GridSettingsForm />
          <GridSettingsStyles />
        </ErrorBoundary>
      ) : <p>Loading...</p>}
    </GridSystemContext.Provider>
  );
}

function GridSettingsStyles() {
  const { gridCss } = useContext(GridSystemContext);
  const highlighted = refractor.highlight(gridCss, "css");

  return (
    <>{gridCss ? (
      <pre className="gs__css language-css"><code className="language-css">
        {renderHAST(highlighted)}
      </code></pre>
    ) : (<p>Loading...</p>)}</>
  );
}

document
  .querySelectorAll("[data-component='grid-system']")
  .forEach((el) => render(<GridSystem />, el));
