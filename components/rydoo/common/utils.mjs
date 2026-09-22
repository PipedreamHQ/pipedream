export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          throw new Error(`Item at index ${index} is not valid JSON: ${e.message}`);
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      throw new Error(`Expected structured JSON but received invalid input: ${e.message}`);
    }
  }
  return obj;
};
