/**
 * Turn records into prop options.
 * @param {object[]} records - Records with `id` and `name` fields
 * @returns {object[]} The options
 */
export function toOptions(records) {
  return records.map(({
    id: value, name: label,
  }) => ({
    label,
    value,
  }));
}
