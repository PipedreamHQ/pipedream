export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return parseObject(item);
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
