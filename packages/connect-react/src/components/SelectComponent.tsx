import { useId } from "react";
import Select from "react-select";
import { useComponents } from "../hooks/use-components";
import {
  AppResponse, V1Component,
} from "@pipedream/sdk";

type SelectComponentProps = {
  app?: Partial<AppResponse> & { name_slug: string; };
  componentType?: "action" | "trigger";
  value?: Partial<V1Component> & { key: string; };
  onChange?: (component?: V1Component) => void;
};

export function SelectComponent({
  app,
  componentType,
  value,
  onChange,
}: SelectComponentProps) {
  const instanceId = useId();
  const {
    isLoading, components,
  } = useComponents({
    app: app?.name_slug,
    componentType,
  });

  const selectedValue = components?.find((c) => c.key === value?.key) || null;

  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      options={components}
      getOptionLabel={(o) => o.name || o.key}
      getOptionValue={(o) => o.key}
      value={selectedValue}
      onChange={(o) => onChange?.((o as V1Component) || undefined)}
      isLoading={isLoading}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
}
