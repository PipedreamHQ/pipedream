function parseJson(value) {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export default {
  // Props typed as `object` / `object[]` can arrive as JSON strings from the
  // Pipedream UI. Normalize them into real objects/arrays before sending.
  parseObject(obj) {
    if (obj === undefined || obj === null) {
      return undefined;
    }
    if (Array.isArray(obj)) {
      return obj.map(parseJson);
    }
    return parseJson(obj);
  },
};
