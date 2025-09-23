import { createContext } from "preact";
import { Children, useId } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";

const GridSettingsTabsContext = createContext();

export default function GridSettingsTabs({
  children,
  defaultTab = 0,
  labels,
  title,
}) {
  const tablistLabelledBy = useId();
  const [selectedIndex, setSelectedIndex] = useState(parseInt(defaultTab, 10));
  const baseId = useId();
  const [tabsData, setTabsData] = useState(undefined);

  useEffect(() => {
    if (labels) {
      setTabsData(labels.map((label, index) => ({
        index,
        tabId: `${baseId}-tab-${index}`,
        tabpanelId: `${baseId}-tabpanel-${index}`,
      })));
    }
  }, [labels?.length, baseId]);

  return tabsData ? (
    <GridSettingsTabsContext.Provider
      value={{
        selectedIndex,
        setSelectedIndex,
        tabsData,
      }}
    >
      <div className="gs__tabs" role="tablist">
        <h2 id={tablistLabelledBy}>{title}</h2>

        {Children.map(labels, (label, index) => (
          <GridSettingsTab {...tabsData[index]}>
            {label}
          </GridSettingsTab>
        ))}
      </div>
      {Children.map(children, (child, index) => (
        <GridSettingsTabPanel {...tabsData[index]}>
          {child}
        </GridSettingsTabPanel>
      ))}
    </GridSettingsTabsContext.Provider>
  ) : (<p>Loading...</p>);
}


function GridSettingsTab({ children, index, tabId, tabpanelId }) {
  const {
    selectedIndex,
    setSelectedIndex,
  } = useContext(GridSettingsTabsContext);
  const selected = selectedIndex === index;

  return (
    <button
      aria-selected={String(selected)}
      aria-controls={tabpanelId}
      className="gs__tab"
      id={tabId}
      onClick={(e) => setSelectedIndex(index)}
      role="tab"
      type="button"
      tabindex={selected ? null : -1}
    >
      {children}
    </button>
  );
}

function GridSettingsTabPanel({ children, index, tabId, tabpanelId }) {
  const {
    selectedIndex,
  } = useContext(GridSettingsTabsContext);
  const selected = selectedIndex === index;

  return (
    <div id={tabpanelId}
      aria-labelledby={tabId}
      aria-hidden={String(!selected)}
      className="gs__tabpanel"
      role="tabpanel"
      tabindex="0"
    >
      {children}
    </div>
  );
}
