export default {
  parseStringToJson(obj, defaultValue = undefined) {
    obj = typeof obj === "string"
      ? JSON.stringify(obj)
      : obj;

    return obj ?? defaultValue;
  },
};
