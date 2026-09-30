import { ConfigurationError } from "@pipedream/platform";

export const filterByText = ({
  items = [], text, fields = [],
}) => {
  const needle = text?.trim().toLowerCase();
  if (!needle) {
    return items;
  }
  return items.filter((item) => fields.some((field) => String(item[field] ?? "")
    .toLowerCase()
    .includes(needle)));
};

export const parseObject = (value) => {
  if (!value) {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError("Document Details must be a valid JSON object, e.g. `{\"format\": {\"margin_inches\": 1}}`.");
  }
};
