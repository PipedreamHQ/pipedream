function parseArray(arr) {
  if (!arr) {
    return undefined;
  }
  return typeof arr === "string"
    ? JSON.parse(arr)
    : arr;
}

export default {
  parseArray,
};
