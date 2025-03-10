export function parseObject (obj) {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return optionalParseAsJSON(item);
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    return optionalParseAsJSON(obj);
  }
  return obj;
};

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function parseObjectEntries(value) {
  const obj = typeof value === "string"
    ? JSON.parse(value)
    : value;
  return Object.fromEntries(
    Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      optionalParseAsJSON(value),
    ]),
  );
}
