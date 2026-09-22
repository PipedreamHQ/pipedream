export const parseObject = (obj) => {
  if (!obj) return undefined;
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};

export const parseArray = (arr) => {
  if (!arr) return undefined;

  // If it's a string, parse it as JSON
  if (typeof arr === "string") {
    return JSON.parse(arr);
  }

  // If it's already an array
  if (Array.isArray(arr)) {
    // Check if first element is a string (needs parsing) or already an object
    if (arr.length === 0) return arr;

    // If first element is an object, assume the whole array is already parsed
    if (typeof arr[0] === "object" && arr[0] !== null) {
      return arr;
    }

    // If elements are strings, parse each one
    return arr.map((item) => {
      if (typeof item === "string") {
        return JSON.parse(item);
      }
      return item;
    });
  }

  return arr;
};
