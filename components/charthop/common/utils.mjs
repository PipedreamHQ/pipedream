function parseObject(obj) {
  if (!obj) {
    return undefined;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  return obj;
}

export {
  parseObject,
};
