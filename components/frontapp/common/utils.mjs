function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

export default {
  emptyStrToUndefined,
  parse(value) {
    const valueToParse = this.emptyStrToUndefined(value);
    if (typeof(valueToParse) === "object" || valueToParse === undefined) {
      return valueToParse;
    }
    try {
      return JSON.parse(valueToParse);
    } catch (e) {
      throw "Make sure the custom expression contains a valid object";
    }
  },
};
