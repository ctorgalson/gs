import { render } from "preact";
import GridSystem from "./components/GridSystem";

const container = document.getElementById("grid-system");
if (container) {
  render(<GridSystem />, container);
}
