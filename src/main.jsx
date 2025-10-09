import { render } from "preact";
import GridSystem from "./components/GridSystem";
import gridDefaults from "./_data/gridDefaults";

const container = document.getElementById("grid-system");
if (container) {
  render(<GridSystem defaultState={gridDefaults} />, container);
}
