import {
  useState, useEffect, useRef,
} from "react";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import {
  getInputStyles, getButtonStyles, getRemoveButtonStyles, getContainerStyles, getItemStyles,
} from "../styles/control-styles";

export function ControlArray() {
  const formFieldContextProps = useFormFieldContext();
  const {
    onChange, prop, value,
  } = formFieldContextProps;
  const {
    getProps, theme,
  } = useCustomize();

  // Initialize values from the current value
  const initializeValues = (): string[] => {
    if (!value || !Array.isArray(value)) {
      return [
        "",
      ];
    }

    const stringValues = value.map((v) => typeof v === "string"
      ? v
      : JSON.stringify(v));
    return stringValues.length > 0
      ? stringValues
      : [
        "",
      ];
  };

  const [
    values,
    setValues,
  ] = useState<string[]>(initializeValues);

  // Only sync on mount or when component prop changes (forces reset)
  // Don't sync on every value change - that fights with user input
  useEffect(() => {
    setValues(initializeValues());
  }, [prop.name]); // Only reset if the prop itself changes (different field)

  const updateArray = (newValues: string[]) => {
    // Filter out empty values
    const validValues = newValues.filter((v) => v.trim() !== "");

    if (validValues.length === 0) {
      onChange(undefined);
      return;
    }

    onChange(validValues as string[]);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const newValues = [
      ...values,
    ];
    newValues[index] = newValue;
    setValues(newValues);
    updateArray(newValues);
  };

  const addValue = () => {
    const newValues = [
      ...values,
      "",
    ];
    setValues(newValues);
  };

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues.length > 0
      ? newValues
      : [
        "",
      ]);
    updateArray(newValues);
  };

  const containerStyles = getContainerStyles();
  const itemStyles = getItemStyles();
  const inputStyles = getInputStyles(theme);
  const buttonStyles = getButtonStyles(theme);
  const removeButtonStyles = getRemoveButtonStyles(theme);

  // Show "Add more" button if the last input has content or if there are multiple inputs
  const shouldShowAddMoreButton = values[values.length - 1]?.trim() || values.length > 1;

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
      {shouldShowAddMoreButton && (
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
