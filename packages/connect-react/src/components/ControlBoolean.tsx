import type { ConfigurableProp } from "@pipedream/sdk";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export function ControlBoolean() {
  const formFieldContextProps = useFormFieldContext<ConfigurableProp.Boolean>();
  const {
    id, value, onChange,
  } = formFieldContextProps;
  const { getProps } = useCustomize();
  const baseStyles: CSSProperties = {
    width: "16px",
    height: "16px",
    gridArea: "control",
    margin: "0 0.5rem 0 0",
  };
  return <input id={id} type="checkbox" {...getProps("controlBoolean", baseStyles, formFieldContextProps)} checked={value ?? false} onChange={(e) => onChange(e.target.checked)} />;
}
