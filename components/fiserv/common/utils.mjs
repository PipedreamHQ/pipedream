const parseJson = (input) => {
  const parse = (value) => {
    if (typeof(value) === "string") {
      try {
        return parseJson(JSON.parse(value));
      } catch (e) {
        return value;
      }
    } else if (typeof(value) === "object" && value !== null) {
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
