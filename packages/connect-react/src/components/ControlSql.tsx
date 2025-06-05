import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export function ControlSql() {
  const formFieldContext = useFormFieldContext();
  const {
    id, onChange, prop, value,
  } = formFieldContext;
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
    fontSize: "0.875rem",
    fontFamily: "monospace",
    minHeight: "120px",
    resize: "vertical",
  };

  return (
    <textarea
      id={id}
      name={prop.name}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="SELECT * FROM table_name"
      required={!prop.optional}
      {...getProps("controlSql", baseStyles, formFieldContext)}
    />
  );
}