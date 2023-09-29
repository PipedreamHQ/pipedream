export const LIMIT = 500;

export const parseObject = (obj) => {
  if (obj && (typeof obj !=  "object")) {
    return JSON.parse(obj);
  }
  return obj;
};
