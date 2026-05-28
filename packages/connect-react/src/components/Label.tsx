import type { CSSProperties } from "react";
import type {
  ConfigurableProp, ConfigurableProps,
} from "@pipedream/sdk";
import { useCustomize } from "../hooks/customization-context";
import type { FormFieldContext } from "../hooks/form-field-context";
import { FormContext } from "../hooks/form-context";

export type LabelProps<T extends ConfigurableProps, U extends ConfigurableProp> = {
  text: string;
  field: FormFieldContext<U>;
  form: FormContext<T>;
};

export function Label<T extends ConfigurableProps, U extends ConfigurableProp>(props: LabelProps<T, U>) {
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
    lineHeight: "1.5",
  };

  // XXX have to fix typing in customization (and elsewhere really)
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <label htmlFor={id} {...getProps("label", baseStyles, props as any)}>{text}</label>
  );
}
