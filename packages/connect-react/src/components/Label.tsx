import type { CSSProperties } from "react";
import type { ConfigurableProp } from "@pipedream/sdk";
import { useCustomize } from "../hooks/customization-context";
import type { FormFieldContext } from "../hooks/form-field-context";
import { FormContext } from "../hooks/form-context";

export type LabelProps<T extends ConfigurableProp> = {
  text: string;
  field: FormFieldContext<T>;
  form: FormContext;
};

export function Label<T extends ConfigurableProp>(props: LabelProps<T>) {
  const {
    text, field,
  } = props;
  const { id } = field;
  const {
    getProps, theme,
  } = useCustomize();

  const baseStyles: CSSProperties = {
    color: theme.colors.neutral90,
    fontWeight: 450,
    gridArea: "label",
    textTransform: "capitalize",
    lineHeight: "1.5",
  };

  return (
    <label htmlFor={id} {...getProps("label", baseStyles, props)}>{text}</label>
  );
}
