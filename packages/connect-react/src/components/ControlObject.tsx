import {
  useState, useEffect, type CSSProperties,
} from "react";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";

type KeyValuePair = {
  key: string;
  value: string;
};

export function ControlObject() {
  const formFieldContextProps = useFormFieldContext();
  const {
    id, onChange, prop, value,
  } = formFieldContextProps;
  const {
    getProps, theme,
  } = useCustomize();

  // Initialize pairs from the current value
  const initializePairs = (): KeyValuePair[] => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return [
        {
          key: "",
          value: "",
        },
      ];
    }

    const pairs = Object.entries(value).map(([
      k,
      v,
    ]) => ({
      key: k,
      value: typeof v === "string"
        ? v
        : JSON.stringify(v),
    }));

    return pairs.length > 0
      ? pairs
      : [
        {
          key: "",
          value: "",
        },
      ];
  };

  const [
    pairs,
    setPairs,
  ] = useState<KeyValuePair[]>(initializePairs);

  // Update pairs when value changes externally
  useEffect(() => {
    setPairs(initializePairs());
  }, [
    value,
  ]);

  const updateObject = (newPairs: KeyValuePair[]) => {
    // Filter out empty pairs
    const validPairs = newPairs.filter((p) => p.key.trim() !== "");

    if (validPairs.length === 0) {
      onChange(undefined);
      return;
    }

    // Convert to object
    const obj: Record<string, any> = {};
    validPairs.forEach((pair) => {
      if (pair.key.trim()) {
        // Try to parse the value as JSON, fallback to string
        try {
          obj[pair.key] = JSON.parse(pair.value);
        } catch {
          obj[pair.key] = pair.value;
        }
      }
    });

    onChange(obj);
  };

  const handlePairChange = (index: number, field: "key" | "value", newValue: string) => {
    const newPairs = [
      ...pairs,
    ];
    newPairs[index] = {
      ...newPairs[index],
      [field]: newValue,
    };
    setPairs(newPairs);
    updateObject(newPairs);
  };

  const addPair = () => {
    const newPairs = [
      ...pairs,
      {
        key: "",
        value: "",
      },
    ];
    setPairs(newPairs);
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs.length > 0
      ? newPairs
      : [
        {
          key: "",
          value: "",
        },
      ]);
    updateObject(newPairs);
  };

  const containerStyles: CSSProperties = {
    gridArea: "control",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const pairStyles: CSSProperties = {
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
    <div {...getProps("controlObject", containerStyles, formFieldContextProps)}>
      {pairs.map((pair, index) => (
        <div key={index} style={pairStyles}>
          <input
            type="text"
            value={pair.key}
            onChange={(e) => handlePairChange(index, "key", e.target.value)}
            placeholder="Key"
            style={inputStyles}
            required={!prop.optional && index === 0}
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => handlePairChange(index, "value", e.target.value)}
            placeholder="Value"
            style={inputStyles}
          />
          {pairs.length > 1 && (
            <button
              type="button"
              onClick={() => removePair(index)}
              style={removeButtonStyles}
              aria-label="Remove pair"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addPair}
        style={{
          ...buttonStyles,
          alignSelf: "flex-start",
          paddingRight: `${theme.spacing.baseUnit * 2}px`,
        }}
      >
        <span>+</span>
        <span>Add more</span>
      </button>
    </div>
  );
}
