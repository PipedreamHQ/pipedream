export function parseObjectValues(obj) {
  return obj && Object.fromEntries(
    Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      JSON.parse(value),
    ]),
  );
}
