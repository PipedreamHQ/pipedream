import { ConfigurationError } from "@pipedream/platform";

function isJson(value) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
}

function parse(value) {
  if (!Object.keys(value).length) {
    throw new ConfigurationError("Please provide at least one object property.");
  }

  if (typeof(value) === "object") {
    return value;
  }

  if (isJson(value)) {
    return JSON.parse(value);
  }

  throw new ConfigurationError("Make sure the custom expression contains a valid object");
}

function parseArray(value) {
  try {
    if (!value) {
      return;
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

function isPhoneNumberValid(phoneNumber) {
  const pattern = new RegExp("^\\+[1-9]{1}[0-9]{0,2}[2-9]{1}[0-9]{2}[2-9]{1}[0-9]{2}[0-9]{4}$");
  return pattern.test(phoneNumber);
}

export default {
  parseArray: (value) => parseArray(value)?.map(parse),
  isPhoneNumberValid,
};
