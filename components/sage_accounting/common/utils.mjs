export function optionalParseFloat(value) {
  return typeof value === "string"
    ? parseFloat(value)
    : value;
}
