export default {
  emptyStrToUndefined(value) {
    const trimmed = typeof (value) === "string" && value.trim();
    return trimmed === ""
      ? undefined
      : value;
  },

  parseStringToJSON(value, defaultValue = {}) {
    return this.emptyStrToUndefined(value)
      ? JSON.parse(value)
      : defaultValue;
  },
};
