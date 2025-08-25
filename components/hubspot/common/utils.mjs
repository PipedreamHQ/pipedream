export const parseObject = (obj) => {
  if (!obj) {
    return undefined;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(parseObject);
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

export const cleanObject = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != "" && _ != undefined && _ != {}))
    .reduce((acc, [
      k,
      v,
    ]) => {
      const result = (!Array.isArray(v) && v === Object(v))
        ? cleanObject(v)
        : v;

      if (Object.keys(result).length === 0) {
        return acc;
      }
      return {
        ...acc,
        [k]: result,
      };}, {});
};
