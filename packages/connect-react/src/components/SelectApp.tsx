import {
  useId, useState, useEffect, useMemo, useCallback,
} from "react";
import Select, { components } from "react-select";
import type {
  MenuListProps, OptionProps, SingleValueProps,
} from "react-select";
import { useApps } from "../hooks/use-apps";
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

  // Memoize custom components to prevent remounting
  // Note: Don't include isLoadingMore in deps - it's read from closure
  // and components will re-render naturally when parent re-renders
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
        {isLoadingMore && (
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
      classNamePrefix="react-select"
      components={customComponents}
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
    />
  );
}
