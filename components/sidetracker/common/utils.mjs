export const parseObject = (obj) => {
  if (!obj) return {};

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => parseObject(item));
  }
  if (typeof obj === "object") {
    for (const [
      key,
      value,
    ] of Object.entries(obj)) {
      obj[key] = parseObject(value);
    }
  }
  return obj;
};
