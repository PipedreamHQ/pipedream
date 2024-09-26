import { ConfigurationError } from "@pipedream/platform";

export const objectToArray = (obj) => {
  const objArray = [];
  obj = parseString(obj);

  if (Object.entries(obj).length) {
    for (const [
      key,
      value,
    ] of Object.entries(obj)) {
      objArray.push({
        name: key,
        value: value,
      });
    }
  }
  return objArray;
};

export const parseString = (str) => {
  try {
    if (typeof str === "string") {
      return JSON.parse(str);
    }
    return str;
  } catch (e) {
    throw new ConfigurationError(e);
  }
};
