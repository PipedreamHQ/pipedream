export const parseObject = (object) => {
  if (!object) return undefined;

  if (Array.isArray(object)) {
    return object.map(parseObject);
  }
  if (typeof object === "string") {
    try {
      return JSON.parse(object);
    } catch (error) {
      return object;
    }
  }
  if (typeof object === "object") {
    return Object.fromEntries(
      Object.entries(object).map(([
        key,
        value,
      ]) => [
        key,
        parseObject(value),
      ]),
    );
  }
  return object;
};
