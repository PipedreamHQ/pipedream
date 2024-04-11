export const parseObject = (obj) => {
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};
