export function parseRowValues(rowValues) {
  if (!rowValues) {
    return undefined;
  }
  if (Array.isArray(rowValues)) {
    return rowValues.map(parseRowValues);
  }
  if (typeof rowValues === "string") {
    try {
      return JSON.parse(rowValues);
    } catch (error) {
      return rowValues;
    }
  }
  return rowValues;
}
