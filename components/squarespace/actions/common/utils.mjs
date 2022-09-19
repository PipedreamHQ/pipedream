export default {
  isString(value) {
    return typeof (value) === "string" && value.trim();
  },
  parseStringToJSON(value, defaultValue = undefined) {
    return this.isString(value)
      ? JSON.parse(value)
      : defaultValue;
  },
};

