export const stringifyObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return JSON.stringify(obj);
  }
  return obj;
};
