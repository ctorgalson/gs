import { render } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { refractor } from "refractor";
import css from "refractor/css";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";
import GridSettingsForm from "./GridSettingsForm";
import renderHAST from "./utils/renderHAST";
import { gridCssTemplate } from "./utils/gridCssTemplate";
import "water.css/out/water.min.css";
import "prismjs/themes/prism-okaidia.min.css";
import "../../assets/css/styles.css";

function GridSystem({
  readOnly = {
    columnsMobile: 1,
    columnsTablet: 2,
  },
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
  const styleRef = useRef(undefined);
  refractor.register(css);

  useEffect(() => {
    const urlParams = new URLSearchParams(state);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

    setGridCss(gridCssTemplate(state));
    window.history.replaceState({}, "", newUrl);
  }, [state]);

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.querySelector("#grid-system-styles");
    }

    styleRef.current.textContent = gridCss;
  }, [gridCss]);

  return gridCss ? (
    <GridSystemContext.Provider value={{ gridCss, readOnly, state, setState }}>
      {
        <ErrorBoundary>
          <GridSettingsForm />
          <GridSettingsStyles />
        </ErrorBoundary>
      }
    </GridSystemContext.Provider>
  ) : (
    <p>Loading...</p>
  );
}

function GridSettingsStyles() {
  const { gridCss } = useContext(GridSystemContext);
  const highlighted = refractor.highlight(gridCss, "css");

  return (
    <>
      {gridCss && highlighted ? (
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
