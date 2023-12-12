function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function strinfied(value) {
  return typeof(value) === "object"
    ? JSON.stringify(value)
    : emptyStrToUndefined(value);
}

function strNumber(value) {
  return Number.isInteger(parseInt(value, 10))
    ? parseInt(value, 10)
    : emptyStrToUndefined(value);
}

function toNumber(value) {
  return typeof(value) === "number"
    ? value
    : strNumber(value);
}

export default {
  emptyStrToUndefined,
  strinfied,
  toNumber,
};
