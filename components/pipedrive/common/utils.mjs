export default {
  parseOrUndefined(value) {
    if (value === undefined) {
      return undefined;
    }
    return typeof(value) === "object"
      ? value
      : JSON.parse(value);
  },
};
