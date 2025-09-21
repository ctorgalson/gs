import { useContext } from "preact/hooks";
import GridSystemContext from "./GridSystemContext";
import GridSettingsFieldset from "./GridSettingsFieldset";

export default function GridSettingsForm() {
  const {
    breakpointDesktop,
    setBreakpointDesktop,
    breakpointTablet,
    setBreakpointTablet,
    columnsDesktop,
    setColumnsDesktop,
    columnsMobile,
    columnsTablet,
  } = useContext(GridSystemContext);

  return (
    <>
      <h2>Grid configuration</h2>
      <form className="gs__form">
        <GridSettingsFieldset fieldsetName="columns" legend="Columns">
          <div>
            <label htmlFor="columns-mobile">
              Grid columns mobile (read-only)
            </label>
            <input
              id="columns-mobile"
              readonly
              size="10"
              type="number"
              value={columnsMobile}
            />
          </div>

          <div>
            <label htmlFor="columns-tablet">
              Grid columns tablet (read-only)
            </label>
            <input
              id="columns-tablet"
              readonly
              size="10"
              type="number"
              value={columnsTablet}
            />
          </div>

          <div>
            <label htmlFor="columns-desktop">Grid Columns desktop</label>
            <input
              id="columns-desktop"
              max="120"
              min="8"
              onChange={(e) => setColumnsDesktop(e.target.value)}
              size="10"
              step="2"
              type="number"
              value={columnsDesktop}
            />
          </div>
        </GridSettingsFieldset>

        <GridSettingsFieldset fieldsetName="breakpoints" legend="Breakpoints">
          <div>
            <label htmlFor="breakpoint-tablet">Breakpoint tablet</label>
            <input
              id="breakpoint-tablet"
              onChange={(e) => setBreakpointTablet(e.target.value)}
              size="10"
              type="text"
              value={breakpointTablet}
            />
          </div>

          <div>
            <label htmlFor="breakpoint-desktop">Breakpoint desktop</label>
            <input
              id="breakpoint-desktop"
              onChange={(e) => setBreakpointDesktop(e.target.value)}
              size="10"
              type="text"
              value={breakpointDesktop}
            />
          </div>
        </GridSettingsFieldset>
      </form>
    </>
  );
}

