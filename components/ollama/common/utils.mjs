import { ConfigurationError } from "@pipedream/platform";

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

function parseArray(value) {
  try {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Not an array");
    }

    return parsedValue;

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid array object");
  }
}

function isJson(value) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

function parseOptions(options) {
  if (!options) {
    return;
  }
  return Object.fromEntries(
    Object.entries(options)
      .map(([
        key,
        value,
      ]) => {
        let parsedValue = isNaN(value)
          ? value
          : Number(value);

        parsedValue = isJson(value)
          ? JSON.parse(value)
          : parsedValue;

        return [
          key,
          parsedValue,
        ];
      }),
  );
}

export default {
  parseArray: (value) => parseArray(value).map(parseJson),
  parseOptions,
};
