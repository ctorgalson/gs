import { createContext, h } from "preact";
import { Children, useId } from "preact/compat";
import LoadingState from "./LoadingState";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

const GridSystemTabsContext = createContext();

/**
 *
 */
export default function GridSystemTabs({
  children,
  className,
  defaultTab = 0,
  labels,
  title,
}) {
  function handleKeydown(event) {
    const { key, target } = event;
    const lastIndex = tabsRefs.current.length - 1;
    let nextIndex;

    if (target.tagName.toLowerCase() !== "button") {
      return;
    }

    switch (key) {
      case "ArrowLeft":
        nextIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;
        break;

      case "ArrowRight":
        nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1;
        break;

      case "End":
        event.preventDefault();
        nextIndex = lastIndex;
        break;

      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;

      default:
    }

    if (typeof nextIndex === "number") {
      setSelectedIndex(nextIndex);
      requestAnimationFrame(() => {
        tabsRefs.current[nextIndex]?.focus();
      });
    }
  }

  const tablistLabelledBy = useId();
  const [selectedIndex, setSelectedIndex] = useState(parseInt(defaultTab, 10));
  const baseId = useId();
  const [tabsData, setTabsData] = useState([]);
  const tabsRefs = useRef(Array(labels.length).fill(null));

  /**
   *
   */
  useEffect(() => {
    // if (labels) {
      setTabsData(
        labels.map((label, index) => ({
          index,
          label,
          tabId: `${baseId}-tab-${index}`,
          tabpanelId: `${baseId}-tabpanel-${index}`,
        })),
      );
    // }
  }, [labels?.length, baseId]);

  return (
    <LoadingState isLoading={!tabsData.length}>
      <GridSystemTabsContext.Provider
        value={{
          selectedIndex,
          setSelectedIndex,
          tabsData,
        }}
      >
        <div
          className={[className, "gs__tabs"].join(" ")}
          onKeydown={handleKeydown}
        >
          <GridSystemTabsHeading id={tablistLabelledBy}>
            {title}
          </GridSystemTabsHeading>

          <div className="gs__tablist" role="tablist">
            {tabsData.map((tabData) => (
              <GridSystemTab {...tabData} tabsRefs={tabsRefs}>
                {tabData.label}
              </GridSystemTab>
            ))}
          </div>

          {Children.map(children, (child, index) => (
            <GridSystemTabPanel {...tabsData[index]}>
              {child}
            </GridSystemTabPanel>
          ))}
        </div>
      </GridSystemTabsContext.Provider>
    </LoadingState>
  );
}

/**
 *
 */
function GridSystemTab({ children, index, tabId, tabpanelId, tabsRefs }) {
  const { selectedIndex, setSelectedIndex } = useContext(GridSystemTabsContext);
  const selected = selectedIndex === index;

  return (
    <button
      aria-selected={String(selected)}
      aria-controls={tabpanelId}
      className="gs__tab"
      id={tabId}
      key={tabId}
      onClick={(e) => setSelectedIndex(index)}
      ref={(el) => (tabsRefs.current[index] = el)}
      role="tab"
      type="button"
      tabindex={selected ? null : -1}
    >
      {children}
    </button>
  );
}

/**
 *
 */
function GridSystemTabsHeading({ children, id, level = 2 }) {
  return h(`h${level}`, { id }, children);
}

/**
 *
 */
function GridSystemTabPanel({ children, index, tabId, tabpanelId }) {
  const { selectedIndex } = useContext(GridSystemTabsContext);
  const selected = selectedIndex === index;

  return (
    <div
      aria-labelledby={tabId}
      aria-hidden={String(!selected)}
      className="gs__tabpanel"
      id={tabpanelId}
      key={tabpanelId}
      role="tabpanel"
      tabindex="0"
    >
      {children}
    </div>
  );
}
