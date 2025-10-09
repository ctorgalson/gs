import { cloneElement, createContext } from "preact";
import { useId } from "preact/compat";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import clsx from "clsx/lite";
import LoadingState from "./LoadingState";

const TabsContext = createContext();

/**
 *
 */
export default function Tabs({ children,
  className,
  defaultTab = 0,
  heading,
  labels,
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
      case "ArrowUp":
        event.preventDefault();
        nextIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;
        break;

      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
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
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const parsedIndex = parseInt(defaultTab, 10);
    return isNaN(parsedIndex)
      ? 0
      : Math.max(0, Math.min(parsedIndex, labels.length - 1));
  });
  const baseId = useId();
  const [tabsData, setTabsData] = useState([]);
  const tabsRefs = useRef(Array(labels.length).fill(null));

  /**
   *
   */
  useEffect(() => {
    setTabsData(
      labels.map((label, index) => ({
        index,
        label,
        tabId: `${baseId}-tab-${index}`,
        tabpanelId: `${baseId}-tabpanel-${index}`,
      })),
    );
  }, [labels, baseId]);

  return (
    <LoadingState isLoading={!tabsData.length}>
      <TabsContext.Provider
        value={{
          selectedIndex,
          setSelectedIndex,
          tabsData,
          tabsRefs,
        }}
      >
        <div
          className={clsx(className, "gs__tabs")}
          onKeydown={handleKeydown}
        >
          {cloneElement(heading, { id: tablistLabelledBy })}

          <div
            aria-labelledby={tablistLabelledBy}
            className={clsx("gs__tablist")}
            role="tablist"
          >
            {tabsData.map((tabData) => (
              <Tab key={tabData.tabId} {...tabData}>{tabData.label}</Tab>
            ))}
          </div>

          {tabsData.map((tabData, index) => (
            <TabPanel
              key={tabData.tabpanelId}
              {...tabData}
            >
              {children[index]}
            </TabPanel>
          ))}
        </div>
      </TabsContext.Provider>
    </LoadingState>
  );
}

/**
 *
 */
function Tab({ children, index, tabId, tabpanelId }) {
  const { selectedIndex, setSelectedIndex, tabsRefs } = useContext(TabsContext);
  const selected = selectedIndex === index;

  return (
    <button
      aria-selected={String(selected)}
      aria-controls={tabpanelId}
      className={clsx("gs__tab")}
      id={tabId}
      key={tabId}
      onClick={(e) => setSelectedIndex(index)}
      ref={(el) => (tabsRefs.current[index] = el)}
      role="tab"
      type="button"
      tabIndex={selected ? null : -1}
    >
      {children}
    </button>
  );
}

/**
 *
 */
function TabPanel({ children, index, tabId, tabpanelId }) {
  const { selectedIndex } = useContext(TabsContext);
  const selected = selectedIndex === index;

  return (
    <div
      aria-labelledby={tabId}
      aria-hidden={String(!selected)}
      className={clsx("gs__tabpanel")}
      id={tabpanelId}
      key={tabpanelId}
      role="tabpanel"
      tabIndex={selected ? 0 : -1}
    >
      {children}
    </div>
  );
}
