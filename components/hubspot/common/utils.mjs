import { ConfigurationError } from "@pipedream/platform";

/**
 * Parse a user-supplied "object" prop (a plain object or a JSON string) into a
 * plain object, raising a clear ConfigurationError instead of a raw SyntaxError
 * or a downstream property-access crash on a non-object value.
 */
export const parseObjectProperties = (value, label = "Object Properties") => {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new ConfigurationError(
        `\`${label}\` must be valid JSON — a JSON object of property name to value.`,
      );
    }
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError(
      `\`${label}\` must be a JSON object of property name to value.`,
    );
  }
  return parsed;
};

export const parseObject = (obj) => {
  if (!obj) {
    return undefined;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  }
  if (typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      parseObject(value),
    ]));
  }
  return obj;
};

export const cleanObject = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != "" && _ != undefined && _ != {}))
    .reduce((acc, [
      k,
      v,
    ]) => {
      const result = (!Array.isArray(v) && v === Object(v))
        ? cleanObject(v)
        : v;

      if (Object.keys(result).length === 0) {
        return acc;
      }
      return {
        ...acc,
        [k]: result,
      };}, {});
};
