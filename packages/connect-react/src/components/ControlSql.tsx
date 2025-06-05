import { useFormFieldContext } from "../hooks/form-field-context";
import { useFormContext } from "../hooks/form-context";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export function ControlSql() {
  const formFieldContext = useFormFieldContext();
  const formContext = useFormContext();
  const {
    id, onChange, prop, value,
  } = formFieldContext;
  const {
    getProps, theme,
  } = useCustomize();
  
  // Find the first app prop to determine which database app to use
  const appProp = formContext.configurableProps.find((p: any) => p.type === "app");
  const appName = appProp?.app || "postgresql"; // Default to postgresql
  
  // Extract the query string from the structured value or use empty string
  const queryValue = typeof value === "object" && value && "query" in value 
    ? (value as any).query 
    : typeof value === "string" 
    ? value 
    : "";

  const handleChange = (queryText: string) => {
    // Transform the simple query string into the structured SQL object
    const sqlObject = {
      app: appName,
      query: queryText,
      params: [], // For now, always empty array
    };
    onChange(sqlObject);
  };
  
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
      value={queryValue}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="SELECT * FROM table_name"
      required={!prop.optional}
      {...getProps("controlSql", baseStyles, formFieldContext)}
    />
  );
}