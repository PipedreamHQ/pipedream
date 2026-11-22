/**
 * Returns each item reduced to only the requested fields. If no fields are
 * given, the items are returned unchanged.
 */
function pluckFields(items = [], fields) {
  if (!fields?.length) {
    return items;
  }
  return items.map((item) => Object.fromEntries(fields.map((field) => [
    field,
    item[field],
  ])));
}

export default {
  pluckFields,
};
