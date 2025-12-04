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
import {
  useCustomize,
  type BaseReactSelectProps,
} from "../hooks/customization-context";
import { createBaseSelectStyles } from "../utils/select-styles";

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
  const {
    select, theme,
  } = useCustomize();

  // Resolve theme color with fallback - uses theme value if defined, otherwise fallback
  const resolveColor = (
    key: keyof typeof theme.colors,
    fallback: string,
  ): string => {
    const current = theme.colors[key];
    return current !== undefined
      ? current
      : fallback;
  };

  const surface = resolveColor("neutral0", "#18181b");
  const border = resolveColor("neutral20", "rgba(255,255,255,0.16)");
  const text = resolveColor("neutral80", "#a1a1aa");
  const textStrong = resolveColor("neutral90", "#e4e4e7");
  const hoverBg = resolveColor("optionHover", "#27272a");
  const selectedBg = resolveColor("optionSelected", "rgba(59,130,246,0.2)");
  const selectedHoverBg = resolveColor("optionSelectedHover", "rgba(59,130,246,0.35)");

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

  const baseSelectProps: BaseReactSelectProps<Component> = {
    styles: createBaseSelectStyles<Component>({
      colors: {
        surface,
        border,
        text,
        textStrong,
        hoverBg,
        selectedBg,
        selectedHoverBg,
      },
      boxShadow: theme.boxShadow,
    }),
  };

  const selectProps = select.getProps("selectComponent", baseSelectProps);

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
      {...selectProps}
      classNamePrefix="react-select"
      options={componentsList}
      getOptionLabel={(o) => o.name || o.key}
      getOptionValue={(o) => o.key}
      value={selectedValue}
      onChange={(o) => onChange?.((o as Component) || undefined)}
      onMenuScrollToBottom={handleMenuScrollToBottom}
      isLoading={isLoading}
      components={{
        ...selectProps.components,
        ...customComponents,
      }}
      menuPortalTarget={
        typeof document !== "undefined"
          ? document.body
          : null
      }
      menuPosition="fixed"
      styles={{
        ...(selectProps.styles ?? {}),
        menuPortal: (base) => ({
          ...base,
          zIndex: 99999,
        }),
      }}
    />
  );
}
