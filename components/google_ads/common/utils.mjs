export function parseObject(value = {}) {
  return Object.entries(value).map(([
    key,
    value,
  ]) => {
    try {
      return [
        key,
        JSON.parse(value),
      ];
    } catch (err) {
      return [
        key,
        value,
      ];
    }
  });
}
