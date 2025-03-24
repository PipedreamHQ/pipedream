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

export const parseError = (data) => {
  if (data.message) return data.message;
  if (data.stderr) return data.stderr;
  if (data.errors) return Object.entries(data.errors[0])[0][1];
};

export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != "" && _ != "$emit"))
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

