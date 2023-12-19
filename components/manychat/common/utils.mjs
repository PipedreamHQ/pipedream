export const parseObj = (obj) => {
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};
