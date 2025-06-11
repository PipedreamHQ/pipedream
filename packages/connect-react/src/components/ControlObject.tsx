import {
  useState, useEffect,
} from "react";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import {
  getInputStyles, getButtonStyles, getRemoveButtonStyles, getContainerStyles, getItemStyles,
} from "../styles/control-styles";

type KeyValuePair = {
  key: string;
  value: string;
};

export function ControlObject() {
  const formFieldContextProps = useFormFieldContext();
  const {
    onChange, prop, value,
  } = formFieldContextProps;
  const {
    getProps, theme,
  } = useCustomize();

  // Check if the value is a plain object (not Date, Function, etc.)
  const isPlainObject = (obj: unknown): boolean => {
    if (obj === null || typeof obj !== "object") {
      return false;
    }

    // Check for Date, Function, RegExp, and other built-in objects
    if (obj instanceof Date || obj instanceof Function || obj instanceof RegExp) {
      return false;
    }

    // Check if it's a plain object with Object.prototype or null prototype
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
  };

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

    if (!isPlainObject(value)) {
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
        : (() => {
          try {
            return JSON.stringify(v);
          } catch {
            // Handle circular references or non-serializable values
            return String(v);
          }
        })(),
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
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      setPairs([
        {
          key: "",
          value: "",
        },
      ]);
      return;
    }

    if (!isPlainObject(value)) {
      setPairs([
        {
          key: "",
          value: "",
        },
      ]);
      return;
    }

    const newPairs = Object.entries(value).map(([
      k,
      v,
    ]) => ({
      key: k,
      value: typeof v === "string"
        ? v
        : (() => {
          try {
            return JSON.stringify(v);
          } catch {
            // Handle circular references or non-serializable values
            return String(v);
          }
        })(),
    }));

    setPairs(newPairs.length > 0
      ? newPairs
      : [
        {
          key: "",
          value: "",
        },
      ]);
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
    const obj: Record<string, unknown> = {};
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

    onChange(obj as Record<string, unknown>);
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

  const containerStyles = getContainerStyles();
  const pairStyles = getItemStyles(); // Reuse item styles for pairs
  const inputStyles = getInputStyles(theme);
  const buttonStyles = getButtonStyles(theme);
  const removeButtonStyles = getRemoveButtonStyles(theme);

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
