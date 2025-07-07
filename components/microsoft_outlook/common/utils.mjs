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
