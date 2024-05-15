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

export function getAdditionalFieldsDescription(link) {
  return `Additional fields to be created. [See the documentation](${link}) for available fields. Values will be parsed as JSON where applicable.`;
}
