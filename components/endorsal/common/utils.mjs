export const parseObj = (obj) => {
  if (obj) {
    if (typeof obj != "object") {
      return JSON.parse(obj);
    }
    return obj;
  }
  return undefined;
};
