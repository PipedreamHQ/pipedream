export const parseObject = (obj) => {
  if (!obj) return obj;

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
    const newObj = {};
    for (const [
      key,
      value,
    ] of Object.entries(obj)) {
      newObj[key] = parseObject(value);
    }
    return newObj;
  }
  return obj;
};
