import {
  useId, useState, useEffect,
} from "react";
import Select, { components } from "react-select";
import { useApps } from "../hooks/use-apps";
import type {
  AppResponse, GetAppsOpts,
} from "@pipedream/sdk";

type SelectAppProps = {
  value?: Partial<AppResponse> & { name_slug: string; };
  onChange?: (app?: AppResponse) => void;
  /**
   * Additional options for fetching apps (sorting, filtering, etc.)
   */
  appsOptions?: Omit<GetAppsOpts, "q">;
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
    // TODO error
    apps,
  } = useApps({
    ...appsOptions ?? {},
    q,
  });
  const {
    Option,
    SingleValue,
  } = components;
  // If we have a value prop but it's not in the search results, use the value prop directly
  const selectedValue = apps?.find((o) => o.name_slug === value?.name_slug)
    || (value?.name_slug
      ? value as AppResponse
      : null);
  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      components={{
        Option: (optionProps) => (
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
        SingleValue: (singleValueProps) => (
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
        IndicatorSeparator: () => null,
      }}
      options={apps || []}
      getOptionLabel={(o) => o.name || o.name_slug} // TODO fetch initial value app so we show name
      getOptionValue={(o) => o.name_slug}
      value={selectedValue}
      onChange={(o) => onChange?.((o as AppResponse) || undefined)}
      onInputChange={(v, { action }) => {
        // Only update on user input, not on blur/menu-close/etc
        if (action === "input-change") {
          setInputValue(v)
        }
      }}
      isLoading={isLoading}
    />
  );
}
