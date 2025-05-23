const parseJson = (input, maxDepth = 100) => {
  const seen = new WeakSet();
  const parse = (value) => {
    if (maxDepth <= 0) {
      return value;
    }
    if (typeof(value) === "string") {
      try {
        return parseJson(JSON.parse(value), maxDepth - 1);
      } catch (e) {
        return value;
      }
    } else if (typeof(value) === "object" && value !== null) {
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
    }
    return value;
  };

  return parse(input);
};

export default {
  parseJson,
};
