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

export const throwError = (message) => {
  const parsedMessage = JSON.parse(message);
  const error = parsedMessage.errors[0];
  const errorParameter =
    error.source.parameter ||
    error.source.pointer ||
    error.meta?.subErrors[0]?.source?.pointer;
  const errorMessage = error.detail || error.title || error.meta?.subErrors[0]?.title;
  throw new ConfigurationError(`${errorParameter} - ${errorMessage}`);
};
