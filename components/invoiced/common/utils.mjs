export const parseObject = (obj) => {
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

export const objectCamelToSnakeCase = (obj) => {
  return Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const newKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    acc[newKey] = value;
    return acc;
  }
  , {});
};
