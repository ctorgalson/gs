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
  gridCssTemplate,
} from "./utils/gridCssTemplate";
import "water.css/out/water.min.css";
import "prismjs/themes/prism-okaidia.min.css";
import "../../assets/css/styles.css";

function GridSystem({
  columnsMobile = 1,
  columnsTablet = 2,
  columnsMultiplier = 2,
  defaults = {
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
  const urlParams = new URLSearchParams(window.location.search);
  const [columnsDesktop, setColumnsDesktop] = useState(
    urlParams.get("columnsDesktop") || defaults.columnsDesktop,
  );
  const [breakpointDesktop, setBreakpointDesktop] = useState(
    urlParams.get("breakpointDesktop") || defaults.breakpointDesktop,
  );
  const [breakpointTablet, setBreakpointTablet] = useState(
    urlParams.get("breakpointTablet") || defaults.breakpointTablet,
  );
  const [columnGapDesktop, setColumnGapDesktop] = useState(
    urlParams.get("columnGapDesktop") || defaults.columnGapDesktop,
  );
  const [columnGapTablet, setColumnGapTablet] = useState(
    urlParams.get("columnGapTablet") || defaults.columnGapTablet,
  );
  const [namespace, setNamespace] = useState(
    urlParams.get("namespace") || defaults.namespace,
  );
  const [rowGapDesktop, setRowGapDesktop] = useState(
    urlParams.get("rowGapDesktop") || defaults.rowGapDesktop,
  );
  const [rowGapMobile, setRowGapMobile] = useState(
    urlParams.get("rowGapMobile") || defaults.rowGapMobile,
  );
  const [rowGapTablet, setRowGapTablet] = useState(
    urlParams.get("rowGapTablet") || defaults.rowGapTablet,
  );
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
    params.set("columnGapDesktop", columnGapDesktop);
    params.set("columnGapTablet", columnGapTablet);
    params.set("columnsDesktop", columnsDesktop);
    params.set("rowGapDesktop", rowGapDesktop);
    params.set("rowGapMobile", rowGapMobile);
    params.set("rowGapTablet", rowGapTablet);
    params.set("namespace", namespace);
    newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    breakpointDesktop,
    breakpointTablet,
    columnGapDesktop,
    columnGapTablet,
    columnsDesktop,
    namespace,
    rowGapDesktop,
    rowGapMobile,
    rowGapTablet,
  ]);

  useEffect(() => {
    const factors = factorizeColumnCount(columnsDesktop);
    const columnsDesktopActual = columnsMultiplier * columnsDesktop;
    const ecSelectors = computeEcSelectors(
      columnsDesktopActual,
      factors,
      namespace,
    );
    const csSelectors = computeCsSelectors(
      columnsDesktop,
      columnsMultiplier,
      namespace,
    );

    setFactors(factors);
    setEcSelectors(ecSelectors);
    setCsSelectors(csSelectors);
    setColumnsDesktopActual(columnsDesktopActual);
    setGridCss(
      gridCssTemplate({
        breakpointDesktop,
        breakpointTablet,
        columnGapDesktop,
        columnGapTablet,
        columnsDesktop,
        columnsMobile,
        columnsTablet,
        csSelectors,
        ecSelectors,
        namespace,
        rowGapDesktop,
        rowGapMobile,
        rowGapTablet,
      }),
    );
  }, [
    breakpointDesktop,
    breakpointTablet,
    columnGapDesktop,
    columnGapTablet,
    columnsDesktop,
    namespace,
    rowGapDesktop,
    rowGapMobile,
    rowGapTablet,
  ]);

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

        columnGapDesktop,
        setColumnGapDesktop,

        columnGapTablet,
        setColumnGapTablet,

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

        rowGapDesktop,
        setRowGapDesktop,

        rowGapMobile,
        setRowGapMobile,

        rowGapTablet,
        setRowGapTablet,
      }}
    >
      {gridCss ? (
        <ErrorBoundary>
          <GridSettingsForm />
          <GridSettingsStyles />
        </ErrorBoundary>
      ) : (
        <p>Loading...</p>
      )}
    </GridSystemContext.Provider>
  );
}

function GridSettingsStyles() {
  const { gridCss } = useContext(GridSystemContext);
  const highlighted = refractor.highlight(gridCss, "css");

  return (
    <>
      {gridCss ? (
        <pre className="gs__css language-css">
          <code className="language-css">{renderHAST(highlighted)}</code>
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

document
  .querySelectorAll("[data-component='grid-system']")
  .forEach((el) => render(<GridSystem />, el));
