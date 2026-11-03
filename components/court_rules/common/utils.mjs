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
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = undefined;
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError("Document Details must be a valid JSON object, e.g. `{\"format\": {\"margin_inches\": 1}}`.");
  }
  return parsed;
};
