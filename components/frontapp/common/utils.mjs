function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

export default {
  emptyStrToUndefined,
  parse(value) {
    if (emptyStrToUndefined(value) === undefined) {
      return undefined;
    }
    if (typeof(value) !== "string") {
      return value;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw `Malformed JSON string ${value}. Please check your input.`;
    }
  },
};
