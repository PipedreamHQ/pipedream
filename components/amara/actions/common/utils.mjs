export default {
  emptyStrToUndefined(value) {
    const trimmed = typeof(value) === "string" && value.trim();
    return trimmed === ""
      ? undefined
      : value;
  },
};
