import {
  useId, useState,
} from "react";
import Select, { components } from "react-select";
import { useApps } from "../hooks/use-apps";
import { AppResponse } from "@pipedream/sdk";

type SelectAppProps = {
  value?: Partial<AppResponse> & { name_slug: string; };
  onChange?: (app?: AppResponse) => void;
};

export function SelectApp({
  value, onChange,
}: SelectAppProps) {
  const [
    q,
    setQ,
  ] = useState(""); // XXX can we just use Select ref.value instead?
  const instanceId = useId();
  const {
    isLoading,
    // TODO error
    apps,
  } = useApps({
    q,
  });
  const { Option } = components;
  return (
    <Select
      instanceId={instanceId}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      components={{
        Option: (props) => (
          <Option {...props}>
            <div style={{
              display: "flex",
              gap: 10,
            }}>
              <img
                src={`https://pipedream.com/s.v0/${props.data.id}/logo/48`}
                style={{
                  height: 24,
                  width: 24,
                }}
                alt={props.data.name}
              />
              <span style={{
                whiteSpace: "nowrap",
              }}>{props.data.name}</span>
            </div>
          </Option>
        ),
        IndicatorSeparator: () => null,
      }}
      options={apps || []}
      getOptionLabel={(o) => o.name || o.name_slug} // TODO fetch initial value app so we show name
      getOptionValue={(o) => o.name_slug}
      value={value}
      onChange={(o) => onChange?.((o as AppResponse) || undefined)}
      onInputChange={(v) => setQ(v)}
      isLoading={isLoading}
    />
  );
}
