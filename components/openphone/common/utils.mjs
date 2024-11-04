export const parseObject = (obj) => {
  if (!obj) return undefined;

  let parsedObj = obj;
  if (typeof obj === "string") {
    try {
      parsedObj = JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }

  if (Array.isArray(parsedObj)) {
    return parsedObj.map((item) => parseObject(item));
  }
  if (typeof parsedObj === "object") {
    for (const [
      key,
      value,
    ] of Object.entries(parsedObj)) {
      parsedObj[key] = parseObject(value);
    }
  }

  return parsedObj;
};
