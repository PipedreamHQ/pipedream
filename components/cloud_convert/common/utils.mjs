const parseJson = (input, maxDepth = 100) => {
  const seen = new WeakSet();
  const parse = (value) => {
    if (maxDepth <= 0) {
      return value;
    }
    if (typeof(value) === "string") {
      // Only parse if the string looks like a JSON object or array
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          return parseJson(JSON.parse(value), maxDepth - 1);
        } catch (e) {
          return value;
        }
      }
      return value;
    } else if (typeof(value) === "object" && value !== null && !Array.isArray(value)) {
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      return Object.entries(value)
        .reduce((acc, [
          key,
          val,
        ]) => Object.assign(acc, {
          [key]: parse(val),
        }), {});
    } else if (Array.isArray(value)) {
      return value.map((item) => parse(item));
    }
    return value;
  };

  return parse(input);
};

export default {
  parseJson,
};
