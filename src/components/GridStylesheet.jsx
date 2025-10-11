import { useContext, useEffect, useRef } from "preact/hooks";
import ErrorBoundary from "./ErrorBoundary";
import GridSystemContext from "./GridSystemContext";

/**
 * Injects generated grid CSS into the document head.
 *
 * Creates a style element on mount and updates its content whenever
 * the grid CSS changes in the context.
 *
 * @returns {null} This component doesn't render any visible output.
 */
export default function GridStylesheet() {
  return (
    <ErrorBoundary>
      <GridStylesheetInner />
    </ErrorBoundary>
  );
}

function GridStylesheetInner() {
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
