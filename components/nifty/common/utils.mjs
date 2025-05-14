export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      ,
      v,
    ]) => (v != null && v != "" && JSON.stringify(v) != "{}"))
    .reduce((acc, [
      k,
      v,
    ]) => ({
      ...acc,
      [k]: (!Array.isArray(v) && v === Object(v))
        ? clearObj(v)
        : v,
    }), {});
};

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function parseObjectEntries(value) {
  if (!value) {
    return {};
  }
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
