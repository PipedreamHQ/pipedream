import { FormContext } from "../hooks/form-context";
import type { FormFieldContext } from "../hooks/form-field-context";
import {
  ConfigurableProp, ConfigurableProps,
} from "@pipedream/sdk";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export type ErrorsProps<T extends ConfigurableProps, U extends ConfigurableProp> = {
  errors: string[];
  field: FormFieldContext<U>;
  form: FormContext<T>;
};

export function Errors<T extends ConfigurableProps, U extends ConfigurableProp>(props: ErrorsProps<T, U>) {
  const { errors } = props;

  const {
    getProps, theme,
  } = useCustomize();

  const baseStyles: CSSProperties = {
    color: theme.colors.danger,
    gridArea: "errors",
  };

  if (!errors.length) {
    return null;
  }

  // TODO depending on type does different shit... we might need async loader around the label, etc.?
  // maybe that should just be handled by FormFieldContext instead of container?
  return (
    <ul {...getProps("errors", baseStyles, props)}>
      {errors.map((msg) => <li key={msg} {...getProps("error", baseStyles, props)}>{msg}</li>)}
    </ul>
  );
}
