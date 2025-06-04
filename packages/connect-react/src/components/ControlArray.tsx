import { useState, useEffect, type CSSProperties } from "react";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";

export function ControlArray() {
  const formFieldContextProps = useFormFieldContext();
  const {
    id, onChange, prop, value,
  } = formFieldContextProps;
  const {
    getProps, theme,
  } = useCustomize();

  // Initialize values from the current value
  const initializeValues = (): string[] => {
    if (!value || !Array.isArray(value)) {
      return [""];
    }
    
    const stringValues = value.map(v => typeof v === "string" ? v : JSON.stringify(v));
    return stringValues.length > 0 ? stringValues : [""];
  };

  const [values, setValues] = useState<string[]>(initializeValues);

  // Update values when value changes externally
  useEffect(() => {
    setValues(initializeValues());
  }, [value]);

  const updateArray = (newValues: string[]) => {
    // Filter out empty values
    const validValues = newValues.filter(v => v.trim() !== "");
    
    if (validValues.length === 0) {
      onChange(undefined);
      return;
    }

    onChange(validValues);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    updateArray(newValues);
  };

  const addValue = () => {
    const newValues = [...values, ""];
    setValues(newValues);
  };

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues.length > 0 ? newValues : [""]);
    updateArray(newValues);
  };

  const containerStyles: CSSProperties = {
    gridArea: "control",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const itemStyles: CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  };

  const inputStyles: CSSProperties = {
    color: theme.colors.neutral60,
    border: "1px solid",
    borderColor: theme.colors.neutral20,
    padding: 6,
    borderRadius: theme.borderRadius,
    boxShadow: theme.boxShadow.input,
    flex: 1,
  };

  const buttonStyles: CSSProperties = {
    color: theme.colors.neutral60,
    display: "inline-flex",
    alignItems: "center",
    padding: `${theme.spacing.baseUnit}px ${theme.spacing.baseUnit * 1.5}px ${
      theme.spacing.baseUnit
    }px ${theme.spacing.baseUnit * 2.5}px`,
    border: `1px solid ${theme.colors.neutral30}`,
    borderRadius: theme.borderRadius,
    cursor: "pointer",
    fontSize: "0.8125rem",
    fontWeight: 450,
    gap: theme.spacing.baseUnit * 2,
    textWrap: "nowrap",
    backgroundColor: "white",
  };

  const removeButtonStyles: CSSProperties = {
    ...buttonStyles,
    flex: "0 0 auto",
    padding: "6px 8px",
  };

  return (
    <div {...getProps("controlArray", containerStyles, formFieldContextProps)}>
      {values.map((value, index) => (
        <div key={index} style={itemStyles}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(index, e.target.value)}
placeholder=""
            style={inputStyles}
            required={!prop.optional && index === 0}
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => removeValue(index)}
              style={removeButtonStyles}
              aria-label="Remove value"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {(values[values.length - 1]?.trim() || values.length > 1) && (
        <button
          type="button"
          onClick={addValue}
          style={{
            ...buttonStyles,
            alignSelf: "flex-start",
            paddingRight: `${theme.spacing.baseUnit * 2}px`,
          }}
        >
          <span>+</span>
          <span>Add more</span>
        </button>
      )}
    </div>
  );
}