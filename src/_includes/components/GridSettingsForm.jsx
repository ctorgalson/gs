import { useContext } from "preact/hooks";
import GridSystemContext from "./GridSystemContext";
import GridSettingsTabs from "./GridSettingsTabs";
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
        id: "columns-mobile",
        fieldName: "columnsMobile",
        label: "Grid columns mobile (read-only)",
        readOnly: true,
      },
      {
        id: "columns-tablet",
        fieldName: "columnsTablet",
        label: "Grid columns tablet (read-only)",
        readOnly: true,
      },
      {
        id: "columns-desktop",
        fieldName: "columnsDesktop",
        label: "Grid columns desktop",
        max: "120",
        min: "8",
        type: "number",
        step: "2",
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
      <h2>Grid configuration</h2>
      <form className="gs__form">
        <GridSettingsTabs defaultTab="1" labels={tabData}>
          {fieldsetData.map((fieldset) => (
            <GridSettingsFieldset {...fieldset} key={fieldset.fieldsetName}>
              {fieldset.fields.map((field) => (
                <GridSettingsField {...field} key={field.id} />
              ))}
            </GridSettingsFieldset>
          ))}
        </GridSettingsTabs>
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
  readOnly = false,
  size = "10",
  step = null,
  type = "text",
}) {
  const { state, setState } = useContext(GridSystemContext);
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
          readOnly={readOnly}
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
          readOnly={readOnly}
          value={state[fieldName]}
        />
      )}
    </div>
  );
}
