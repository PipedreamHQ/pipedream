import {
  App,
  Component,
} from "@pipedream/sdk";
import {
  useId,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Select, { components } from "react-select";
import type { MenuListProps } from "react-select";
import { useComponents } from "../hooks/use-components";

type SelectComponentProps = {
  app?: Partial<App> & { nameSlug: string; };
  componentType?: "action" | "trigger";
  value?: Partial<Component> & { key: string; };
  onChange?: (component?: Component) => void;
};

export function SelectComponent({
  app,
  componentType,
  value,
  onChange,
}: SelectComponentProps) {
  const instanceId = useId();
  const {
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    components: componentsList,
  } = useComponents({
    app: app?.nameSlug,
    componentType,
  });

  const { MenuList } = components;
  const isLoadingMoreRef = useRef(isLoadingMore);
  isLoadingMoreRef.current = isLoadingMore;

  // Memoize the selected value to prevent unnecessary recalculations
  const selectedValue = useMemo(() => {
    return componentsList?.find((c: Component) => c.key === value?.key) || null;
  }, [
    componentsList,
    value?.key,
  ]);

  // Memoize loadMore callback
  const handleMenuScrollToBottom = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [
    hasMore,
    isLoadingMore,
    loadMore,
  ]);

  // Memoize custom components to prevent remounting
  const customComponents = useMemo(() => ({
    MenuList: (props: MenuListProps<Component>) => (
      <MenuList {...props}>
        {props.children}
        {isLoadingMoreRef.current && (
          <div style={{
            padding: "8px 12px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}>
            Loading more {componentType === "action"
              ? "actions"
              : "triggers"}...
          </div>
        )}
      </MenuList>
    ),
    IndicatorSeparator: () => null,
  }), [
    componentType,
    MenuList,
  ]);

  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      options={componentsList}
      getOptionLabel={(o) => o.name || o.key}
      getOptionValue={(o) => o.key}
      value={selectedValue}
      onChange={(o) => onChange?.((o as Component) || undefined)}
      onMenuScrollToBottom={handleMenuScrollToBottom}
      isLoading={isLoading}
      components={customComponents}
      menuPortalTarget={
        typeof document !== "undefined"
          ? document.body
          : null
      }
      menuPosition="fixed"
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 99999,
        }),
      }}
    />
  );
}
