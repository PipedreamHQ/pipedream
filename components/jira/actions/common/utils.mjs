export default {
  emptyStrToUndefined(value) {
    const trimmed = typeof (value) === "string" && value.trim();
    return trimmed === ""
      ? undefined
      : value;
  },

  isString(value) {
    return typeof (value) === "string" && value.trim();
  },

  parseStringToJSON(value, defaultValue = undefined) {
    return this.isString(value)
      ? JSON.parse(value)
      : defaultValue;
  },
};
