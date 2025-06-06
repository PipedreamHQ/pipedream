import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";
import type { ConfigurablePropSql } from "@pipedream/sdk";

// Type guard to check if value is a structured SQL object
const isSqlStructuredValue = (value: unknown): value is { app: string; query: string; params: unknown[] } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "query" in value &&
    typeof (value as Record<string, unknown>).query === "string"
  );
};

export function ControlSql() {
  const formFieldContext = useFormFieldContext();
  const {
    id, onChange, prop, value,
  } = formFieldContext;
  const {
    getProps, theme,
  } = useCustomize();

  // Cast prop to SQL prop type (this component is only used for SQL props)
  const sqlProp = prop as ConfigurablePropSql;

  // Get the app name from the SQL prop's auth configuration
  const appName = sqlProp.auth?.app || "postgresql"; // Default to postgresql

  // Extract the query string from the structured value or use empty string
  let queryValue = "";
  if (isSqlStructuredValue(value)) {
    queryValue = value.query;
  } else if (typeof value === "string") {
    queryValue = value;
  }

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
