export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return parseObject(item);
      }
      return item;
    });
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
