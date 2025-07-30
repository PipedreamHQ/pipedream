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

export const clearEmpty = (obj) => {
  if (!obj) return undefined;

  const newObj = {
    ...obj,
  };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === "" || newObj[key] === null || newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};
