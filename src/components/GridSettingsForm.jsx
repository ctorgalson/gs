import { useContext } from "preact/hooks";
import GridSystemContext from "./GridSystemContext";
import Tabs from "./Tabs";
import GridSettingsFieldset from "./GridSettingsFieldset";

const fieldsetData = [
  {
    fieldsetName: "breakpoints",
    legend: "Breakpoints",
    fields: [
      {
        id: "breakpoint-tablet",
        fieldName: "breakpointTablet",
        label: "Breakpoint Tablet",
      },
      {
        id: "breakpoint-desktop",
        fieldName: "breakpointDesktop",
        label: "Breakpoint Desktop",
      },
    ],
  },
  {
    fieldsetName: "columns",
    legend: "Columns",
    fields: [
      {
        id: "columns",
        fieldName: "columns",
        label: "Grid columns",
        max: "120",
        min: "8",
        step: "2",
        type: "number",
      },
    ],
  },
  {
    fieldsetName: "column-gaps",
    legend: "Column Gaps",
    fields: [
      {
        id: "column-gap-tablet",
        label: "Column gap (tablet)",
        fieldName: "columnGapTablet",
      },
      {
        id: "column-gap-desktop",
        label: "Column gap (desktop)",
        fieldName: "columnGapDesktop",
      },
    ],
  },

  {
    fieldsetName: "row-gaps",
    legend: "Row Gaps",
    fields: [
      {
        id: "row-gap-mobile",
        label: "Row gap (mobile)",
        fieldName: "rowGapMobile",
      },
      {
        id: "row-gap-tablet",
        label: "Row gap (tablet)",
        fieldName: "rowGapTablet",
      },
      {
        id: "row-gap-desktop",
        label: "Row gap (desktop)",
        fieldName: "rowGapDesktop",
      },
    ],
  },
];
const tabData = fieldsetData.map((f) => f.legend);

export default function GridSettingsForm() {
  return (
    <>
      <form className="gs__form">
        <Tabs
          defaultTab="1"
          labels={tabData}
          heading={<h2>Grid configuration</h2>}
        >
          {fieldsetData.map((fieldset) => (
            <GridSettingsFieldset {...fieldset} key={fieldset.fieldsetName}>
              {fieldset.fields.map((field) => (
                <GridSettingsField {...field} key={field.id} />
              ))}
            </GridSettingsFieldset>
          ))}
        </Tabs>
      </form>
    </>
  );
}

export function GridSettingsField({
  id,
  label,
  fieldName,
  min = null,
  max = null,
  size = "10",
  step = null,
  type = "text",
}) {
  const { readOnly, state, setState } = useContext(GridSystemContext);
  const updateField = (name, value) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {type === "number" ? (
        <input
          id={id}
          max={max}
          min={min}
          name={fieldName}
          onChange={(e) => updateField(e.target.name, e.target.value)}
          size={size}
          step={step}
          type={type}
          value={state[fieldName]}
        />
      ) : (
        <input
          id={id}
          max={max}
          min={min}
          name={fieldName}
          onBlur={(e) => updateField(e.target.name, e.target.value)}
          value={state[fieldName]}
        />
      )}
    </div>
  );
}
