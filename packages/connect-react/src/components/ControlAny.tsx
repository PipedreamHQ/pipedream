import {
  ConfiguredPropValueInteger,
  ConfiguredPropValueObject,
  ConfiguredPropValueString,
  ConfiguredPropValueStringArray,
} from "@pipedream/sdk";
import type { CSSProperties } from "react";

import { useCustomize } from "../hooks/customization-context";
import { useFormFieldContext } from "../hooks/form-field-context";

export function ControlAny() {
  const formFieldContext = useFormFieldContext();
  const {
    id, onChange, value,
  } = formFieldContext;
  const {
    getProps, theme,
  } = useCustomize();
  const baseStyles: CSSProperties = {
    display: "block",
    gridArea: "control",
    width: "100%",
    fontSize: "0.875rem",
    boxShadow: theme.boxShadow.input,
  };

  let jsonValue = value as
    | ConfiguredPropValueInteger
    | ConfiguredPropValueObject
    | ConfiguredPropValueString
    | ConfiguredPropValueStringArray;
  if (typeof jsonValue === "object") {
    jsonValue = JSON.stringify(jsonValue);
  }

  // XXX this needs to be a more complex component so disabled above
  return (
    <textarea
      id={id}
      value={jsonValue}
      onChange={(e) => onChange(e.target.value)}
      {...getProps("controlAny", baseStyles, formFieldContext)}
    />
  );
}
