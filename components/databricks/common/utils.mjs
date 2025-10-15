const parseObject = (obj) => {
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

export default {
  parseObject,
  parseJsonInput: (value) => {
    return value
      ? parseObject(value)
      : undefined;
  },
};
