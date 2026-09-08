import { ConfigurationError } from "@pipedream/platform";

const removeNullEntries = (obj) =>
  Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNotEmpyString = typeof value === "string";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length !== 0;
    return value && (isNotEmpyString || isNotEmptyArray || isNotEmptyObject)
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

// For props declared as `string[]` whose entries must each be a JSON object. Unlike
// `parseObject`, malformed JSON is reported as a `ConfigurationError` instead of a bare
// `SyntaxError`, and a non-object entry is rejected instead of being forwarded to Xero as
// a string. An entry holding a whole JSON array is flattened rather than rejected — some
// prop descriptions show their example wrapped in `[ ]`, so that mistake is common.
const parseObjectArray = (values, fieldName) => {
  if (!values) {
    return undefined;
  }

  const entries = Array.isArray(values)
    ? values
    : [
      values,
    ];

  const parsedEntries = entries
    .filter((entry) => entry !== undefined && entry !== null && entry !== "")
    .flatMap((entry) => {
      if (typeof entry !== "string") {
        return entry;
      }
      try {
        return JSON.parse(entry);
      } catch {
        throw new ConfigurationError(`${fieldName}: \`${entry}\` is not valid JSON. Provide one JSON object per entry.`);
      }
    })
    .map((parsed) => {
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new ConfigurationError(`${fieldName}: \`${JSON.stringify(parsed)}\` is not a JSON object. Provide one JSON object per entry.`);
      }
      return parsed;
    });

  // Left as `undefined` rather than `[]` so an unset prop stays absent from the request
  // body — Xero treats an empty collection as "remove everything in it".
  return parsedEntries.length
    ? parsedEntries
    : undefined;
};

const formatLineItems = (lineItems) => parseObjectArray(lineItems, "Line Items") ?? [];

const deleteKeys = (mainObject, keys = []) => {
  return Object.keys(mainObject)
    .filter((key) => !keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = mainObject[key];
      return obj;
    }, {});
};

const isValidDate = (dateString, key) => {
  if (!dateString) return;
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) {
    throw new ConfigurationError(`Invalid Date set for ${key}`);
  }
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    throw new ConfigurationError(`Invalid Date set for ${key}`);
  }
  return d.toISOString().slice(0, 10) === dateString;
};

const formatQueryString = (payload, quoteValue = false) => {
  const str = [];
  Object.keys(payload).forEach((p) => {
    const result = Array.isArray(payload[p])
      ? formatArray(p, payload[p])
      : formatNonArray(p, payload[p], quoteValue);
    result && str.push(result);
  });
  return str.join("&");
};

const formatArray = (key, value) => {
  const str = [];
  if (value.length) {
    for (let i = 0; i < value.length; i++) {
      value[i] &&
        str.push(
          `${encodeURIComponent(key + `[${i}]`)}=${encodeURIComponent(
            value[i],
          )}`,
        );
    }
    return str.join("&");
  }
  return null;
};

const formatNonArray = (key, value, quoteValue) =>
  value &&
  `${encodeURIComponent(key)}=${quoteValue
    ? "\""
    : ""}${value}${
    quoteValue
      ? "\""
      : ""
  }`;

const formatJsonDate = (date) => {
  const pattern = /Date\(([^)]+)\)/;
  const modified = pattern.exec(date);
  return modified && new Date(parseFloat(modified[1])).toISOString();
};

const chainQueryString = (queryString) =>
  queryString && queryString.split("&").join(" AND ");

const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

export {
  chainQueryString,
  deleteKeys,
  formatJsonDate,
  formatLineItems,
  formatQueryString,
  isValidDate,
  parseObject,
  parseObjectArray,
  removeNullEntries,
};

