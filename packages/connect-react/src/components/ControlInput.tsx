import type { CSSProperties } from "react";
import type { ConfigurablePropInteger } from "@pipedream/sdk";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import { isConfigurablePropOfType } from "../utils/type-guards";

export function ControlInput() {
  const formFieldContextProps = useFormFieldContext();
  const {
    id, onChange, prop, value,
  } = formFieldContextProps;
  const {
    getProps, theme,
  } = useCustomize();

  const baseStyles: CSSProperties = {
    color: theme.colors.neutral60,
    display: "block",
    border: "1px solid",
    borderColor: theme.colors.neutral20,
    padding: 6,
    width: "100%",
    borderRadius: theme.borderRadius,
    gridArea: "control",
    boxShadow: theme.boxShadow.input,
  };

  let autoComplete = "off";

  let inputType: HTMLInputElement["type"] = "text";
  let toOnChangeValue = (v: string): typeof value => v;
  switch (prop.type) {
  case "string":
    break;
  case "integer":
    inputType = "number"; // XXX may not want this... inputmode="numeric", etc.
    toOnChangeValue = (v) => v
      ? parseInt(v)
      : undefined;
    break;
  default:
    throw new Error("unexpected prop.type for ControlInput: " + prop.type);
  }

  // TODO need to figure out reifying values that are saved though on this path
  if ("secret" in prop && prop.secret) {
    inputType = "password";
    autoComplete = "new-password"; // in chrome, this is better than "off" here
  }

  const min = isConfigurablePropOfType(prop, "integer")
    ? prop.min
    : undefined;
  const max = isConfigurablePropOfType(prop, "integer")
    ? prop.max
    : undefined;

  return (
    <input
      id={id}
      type={inputType}
      name={prop.name}
      value={String(value ?? "")}
      onChange={(e) => onChange(toOnChangeValue(e.target.value))}
      {...getProps("controlInput", baseStyles, formFieldContextProps)}
      min={min}
      max={max}
      autoComplete={autoComplete}
      data-lpignore="true"
      data-1p-ignore="true"
      required={!prop.optional}
    />
  );
}
