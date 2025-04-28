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

const fromDateToInteger = (date) => {
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return Math.floor(parsedDate.getTime() / 1000);
    }
  }
};

export default {
  parseJson: (input) => {
    const parsed = parseJson(input);
    return typeof parsed === "object" && parsed !== null
      ? parsed
      : {};
  },
  fromDateToInteger,
};
