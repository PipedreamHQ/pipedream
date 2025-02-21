function parseObject(obj) {
  if (!obj) {
    return undefined;
  }

  return typeof obj === "string"
    ? JSON.parse(obj)
    : obj;
}

function parseArray(arr) {
  if (!arr) {
    return undefined;
  }

  if (typeof arr === "string") {
    return JSON.parse(arr);
  }

  if (Array.isArray(arr)) {
    return arr.map((item) => parseObject(item));
  }

  return arr;
}

export default {
  parseObject,
  parseArray,
};
