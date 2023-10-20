export const parseObject = (obj) => {
  if (typeof obj != "object") {
    return JSON.parse(obj);
  }
  return obj;
};
