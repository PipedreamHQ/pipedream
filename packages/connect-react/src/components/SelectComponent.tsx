import {
  App,
  Component,
} from "@pipedream/sdk";
import { useId } from "react";
import Select from "react-select";
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
    isLoading, components,
  } = useComponents({
    app: app?.nameSlug,
    componentType,
  });

  const selectedValue = components?.find((c: Component) => c.key === value?.key) || null;

  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      options={components}
      getOptionLabel={(o) => o.name || o.key}
      getOptionValue={(o) => o.key}
      value={selectedValue}
      onChange={(o) => onChange?.((o as Component) || undefined)}
      isLoading={isLoading}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
}
