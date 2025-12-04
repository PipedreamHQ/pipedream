import {
  useId, useState, useEffect, useMemo, useCallback, useRef,
} from "react";
import Select, { components } from "react-select";
import type {
  MenuListProps, OptionProps, SingleValueProps,
} from "react-select";
import { useApps } from "../hooks/use-apps";
import { defaultTheme } from "../theme";
import {
  useCustomize,
  type BaseReactSelectProps,
} from "../hooks/customization-context";
import type {
  App,
  AppsListRequest,
} from "@pipedream/sdk";

type SelectAppProps = {
  value?: Partial<App> & { nameSlug: string; };
  onChange?: (app?: App) => void;
  /**
   * Additional options for fetching apps (sorting, filtering, etc.)
   */
  appsOptions?: Omit<AppsListRequest, "q">;
};

export function SelectApp({
  value, onChange, appsOptions,
}: SelectAppProps) {
  const [
    inputValue,
    setInputValue,
  ] = useState("");
  const [
    q,
    setQ,
  ] = useState(""); // Debounced query value

  const instanceId = useId();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(inputValue);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [
    inputValue,
  ]);

  const {
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    // TODO error
    apps,
  } = useApps({
    ...appsOptions ?? {},
    q,
  });

  const {
    Option,
    SingleValue,
    MenuList,
  } = components;
  const { select, theme } = useCustomize();
  const isLoadingMoreRef = useRef(isLoadingMore);
  isLoadingMoreRef.current = isLoadingMore;

  // Memoize the selected value to prevent unnecessary recalculations
  const selectedValue = useMemo(() => {
    return apps?.find((o: App) => o.nameSlug === value?.nameSlug)
      || (value?.nameSlug
        ? value as App
        : null);
  }, [
    apps,
    value?.nameSlug,
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

  const resolveColor = (
    key: keyof typeof defaultTheme.colors,
    fallback: string,
  ) => {
    const current = theme.colors[key];
    const baseline = defaultTheme.colors[key];
    return current && current !== baseline
      ? current
      : fallback;
  };

  const surface = resolveColor("neutral0", "#18181b");
  const border = resolveColor("neutral20", "rgba(255,255,255,0.16)");
  const text = resolveColor("neutral80", "#a1a1aa");
  const textStrong = resolveColor("neutral90", "#e4e4e7");
  // Hover state - visible gray
  const hoverBg = "#27272a";
  // Selected state - subtle blue
  const selectedBg = "rgba(59,130,246,0.2)";
  // Selected + hover - brighter blue
  const selectedHoverBg = "rgba(59,130,246,0.35)";

  const baseSelectProps: BaseReactSelectProps<App> = {
    styles: {
      control: (base) => ({
        ...base,
        backgroundColor: surface,
        borderColor: border,
        color: text,
        boxShadow: theme.boxShadow.input,
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: surface,
        boxShadow: theme.boxShadow.dropdown,
      }),
      singleValue: (base) => ({
        ...base,
        color: text,
      }),
      input: (base) => ({
        ...base,
        color: text,
      }),
      option: (base, state) => {
        let bg = surface;
        if (state.isSelected && state.isFocused) {
          bg = selectedHoverBg;
        } else if (state.isSelected) {
          bg = selectedBg;
        } else if (state.isFocused) {
          bg = hoverBg;
        }
        return {
          ...base,
          backgroundColor: bg,
          color: textStrong,
        };
      },
    },
  };

  const selectProps = select.getProps("selectApp", baseSelectProps);

  // Memoize custom components to prevent remounting
  const customComponents = useMemo(() => ({
    Option: (optionProps: OptionProps<App>) => (
      <Option {...optionProps}>
        <div style={{
          display: "flex",
          gap: 10,
        }}>
          <img
            src={`https://pipedream.com/s.v0/${optionProps.data.id}/logo/48`}
            style={{
              height: 24,
              width: 24,
              backgroundColor: "#fff",
              borderRadius: 6,
              padding: 2,
            }}
            alt={optionProps.data.name}
          />
          <span style={{
            whiteSpace: "nowrap",
          }}>{optionProps.data.name}</span>
        </div>
      </Option>
    ),
    SingleValue: (singleValueProps: SingleValueProps<App>) => (
      <SingleValue {...singleValueProps}>
        <div style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}>
          <img
            src={`https://pipedream.com/s.v0/${singleValueProps.data.id}/logo/48`}
            style={{
              height: 24,
              width: 24,
              backgroundColor: "#fff",
              borderRadius: 6,
              padding: 2,
            }}
            alt={singleValueProps.data.name}
          />
          <span style={{
            whiteSpace: "nowrap",
          }}>
            {singleValueProps.data.name}
          </span>
        </div>
      </SingleValue>
    ),
    MenuList: (props: MenuListProps<App>) => (
      <MenuList {...props}>
        {props.children}
        {isLoadingMoreRef.current && (
          <div style={{
            padding: "8px 12px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}>
            Loading more apps...
          </div>
        )}
      </MenuList>
    ),
    IndicatorSeparator: () => null,
  }), [
    Option,
    SingleValue,
    MenuList,
  ]);
  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      {...selectProps}
      classNamePrefix="react-select"
      components={{
        ...selectProps.components,
        ...customComponents,
      }}
      options={apps || []}
      getOptionLabel={(o: App) => o.name || o.nameSlug}
      getOptionValue={(o: App) => o.nameSlug}
      value={selectedValue}
      onChange={(o) => onChange?.((o as App) || undefined)}
      onInputChange={(v, { action }) => {
        // Only update on user input, not on blur/menu-close/etc
        if (action === "input-change") {
          setInputValue(v)
        }
      }}
      onMenuScrollToBottom={handleMenuScrollToBottom}
      isLoading={isLoading}
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
