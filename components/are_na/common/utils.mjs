/**
 * Keep only the requested fields of each item. Dot paths (e.g. `owner.name`)
 * are supported. Returns the items unchanged when no fields are given, and an
 * empty array when items is null or undefined.
 */
function pluckFields(items, fields) {
  const list = items ?? [];
  if (!fields?.length) return list;
  return list.map((item) => {
    const picked = {};
    for (const path of fields) {
      const keys = path.split(".");
      const value = keys.reduce((obj, key) => obj?.[key], item);
      if (value === undefined) continue;
      let target = picked;
      keys.slice(0, -1).forEach((key) => {
        target = target[key] ??= {};
      });
      target[keys[keys.length - 1]] = value;
    }
    return picked;
  });
}

export default {
  pluckFields,
};
