const splitCommaSeparated = (value) =>
  value.split(",").map((v) => v.trim())
    .filter(Boolean);

export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.flatMap((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return splitCommaSeparated(item);
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return splitCommaSeparated(obj);
    }
  }
  return obj;
};
