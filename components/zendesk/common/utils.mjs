export const toCommaSeparated = (value) => {
  if (Array.isArray(value)) {
    return value.join(",");
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(",");
      }
    } catch {
      // not a JSON array string, return as-is
    }
  }
  return value;
};

export const parseObject = (obj) => {
  if (!obj) {
    return {};
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
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
