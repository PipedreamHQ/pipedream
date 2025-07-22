export interface OptionWithValue {
  value: string | number;
  label?: string;
  __lv?: any;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isOptionWithValue(value: unknown): value is OptionWithValue {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in value
  );
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isOptionArray(value: unknown): value is OptionWithValue[] {
  return Array.isArray(value) && value.every((item) => isOptionWithValue(item));
}

export function normalizeOption(option: unknown): OptionWithValue | string {
  if (isString(option)) {
    return option;
  }
  if (isOptionWithValue(option)) {
    return option;
  }
  return String(option);
}

export function normalizeOptions(options: unknown): Array<OptionWithValue | string> {
  if (!Array.isArray(options)) {
    return [];
  }
  return options.map(normalizeOption);
}
