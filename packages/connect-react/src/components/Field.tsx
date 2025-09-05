import { FormContext } from "../hooks/form-context";
import { FormFieldContext } from "../hooks/form-field-context";
import { ConfigurableProp } from "@pipedream/sdk";
import { Control } from "./Control";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export type FieldProps<T extends ConfigurableProp> = {
  form: FormContext<T[]>;
  field: FormFieldContext<T>;
};

// XXX should support overriding like this:
// MyField(props) {
//   if (props...) {
//      /* my special thing */
//   }
//   return <Field {...props}> // otherwise fallback on default
// }
export function Field<T extends ConfigurableProp>(props: FieldProps<T>) {
  const {
    form, field,
  } = props;
  const { prop } = field;
  const {
    getProps, getComponents,
  } = useCustomize();
  const baseStyles: CSSProperties = {
    display: "grid",
    gridTemplateAreas:
      field.prop.type == "boolean"
        ? "\"control label\" \"description description\" \"error error\""
        : "\"label label\" \"control control\" \"description description\" \"error error\"",
    gridTemplateColumns: "min-content auto",
    gap: "0.25rem 0",
    alignItems: "center",
    fontSize: "0.875rem",
  };
  const {
    Label, Description, Errors,
  } = getComponents();

  const app = "app" in field.extra
    ? field.extra.app
    : undefined;
  if (app && !app.auth_type) {
    return null;
  }

  let labelText = prop.label || prop.name; // XXX capitalize so we don't need the default style?
  if (app) {
    labelText = `Connect ${app.name} account`;
  }

  // TODO default grids based on type (to support default checkbox)
  // TODO depending on type does different shit... we might need async loader around the label, etc.?
  // maybe that should just be handled by FormFieldContext instead of container?
  // XXX rename to FieldErrors + add FormErrors (to ComponentFormInternal)
  // XXX use similar pattern as app below for boolean and checkboxing DOM re-ordering?

  return (
    <div {...getProps("field", baseStyles, props as FieldProps<ConfigurableProp>)}>
      <Label text={labelText} field={field} form={form} />
      <Control field={field} form={form} />
      <Description markdown={prop.description} field={field} form={form} />
      <Errors field={field} form={form} />
    </div>
  );
}
