import { ConfigurationError } from "@pipedream/platform";

export const parseObj = (obj) => {
  if (typeof obj != "object") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      throw new ConfigurationError(e);
    }
  }
  return obj;
};

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
