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
    isLoading,
    // TODO error
    components,
  } = useComponents({
    app: app?.name_slug,
    componentType,
  });
  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      options={components}
      getOptionLabel={(o) => o.name || o.key} // TODO fetch default component so we show name (or just prime correctly in demo)
      getOptionValue={(o) => o.key}
      value={value}
      onChange={(o) => onChange?.((o as V1Component) || undefined)}
      isLoading={isLoading}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
}
