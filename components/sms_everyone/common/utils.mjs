import { ConfigurationError } from "@pipedream/platform";

export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

export const checkTmp = (filename) => {
  if (!filename.startsWith("/tmp")) {
    return `/tmp/${filename}`;
  }
  return filename;
};

export const checkPhoneNumbers = (phoneNumbers) => {
  phoneNumbers.map((phoneNumber) => {
    if (!phoneNumber.startsWith("+"))
      throw new ConfigurationError("The phone numbers must start with '+'");
  });
};
