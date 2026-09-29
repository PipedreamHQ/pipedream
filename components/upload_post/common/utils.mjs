import FormData from "form-data";

const isEmpty = (value) => value === undefined
  || value === null
  || value === ""
  || (Array.isArray(value) && value.length === 0);

/**
 * Parses a value that may be a JSON string (as entered in the Pipedream UI)
 * into its JS representation. Non-JSON strings are returned untouched.
 */
const parseValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

/**
 * Parses the "Additional Fields" object prop. Every value is optional and may
 * arrive as a JSON string, so each one is parsed individually.
 */
const parseObject = (obj) => {
  if (isEmpty(obj)) {
    return {};
  }
  const parsed = parseValue(obj);
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Additional Fields must be an object of `field: value` pairs");
  }
  return Object.fromEntries(
    Object.entries(parsed).map(([
      key,
      value,
    ]) => [
      key,
      parseValue(value),
    ]),
  );
};

/**
 * Builds the multipart/form-data body expected by the Upload-Post upload
 * endpoints. Array values are sent as repeated `name[]` fields (e.g.
 * `platform[]`, `tags[]`, `poll_options[]`), booleans and numbers as their
 * string representation, and empty values are skipped.
 */
const buildFormData = (fields = {}) => {
  const form = new FormData();
  for (const [
    key,
    value,
  ] of Object.entries(fields)) {
    if (isEmpty(value)) {
      continue;
    }
    if (Array.isArray(value)) {
      const arrayKey = key.endsWith("[]")
        ? key
        : `${key}[]`;
      for (const item of value) {
        if (!isEmpty(item)) {
          form.append(arrayKey, String(item));
        }
      }
    } else if (typeof value === "object") {
      form.append(key, JSON.stringify(value));
    } else {
      form.append(key, String(value));
    }
  }
  return form;
};

export default {
  isEmpty,
  parseObject,
  buildFormData,
};
