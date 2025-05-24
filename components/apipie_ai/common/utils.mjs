/**
* Safely parses JSON strings or arrays of JSON strings into JavaScript objects
* @param {any} obj - Input that may be a JSON string, array of JSON strings, or any other value
* @returns {any} - Parsed object(s) or the original input if parsing fails
*/
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
