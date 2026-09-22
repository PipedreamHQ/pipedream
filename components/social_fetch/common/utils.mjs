/**
 * Truncate top-level arrays in a response `data` object to keep step exports
 * manageable, flagging any array that was shortened.
 *
 * @param {Record<string, unknown> | undefined} data
 * @param {number} max
 */
export function truncateArrays(data, max) {
  if (!data || typeof data !== "object") {
    return data;
  }
  const notices = [];
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key]) && data[key].length > max) {
      const total = data[key].length;
      data[key] = data[key].slice(0, max);
      notices.push(`${key} truncated to ${max} of ${total} items`);
    }
  }
  if (notices.length) {
    data._truncated = notices;
  }
  return data;
}

/**
 * Recursively compare two objects and return a structured diff map.
 *
 * @param {Record<string, unknown>} obj1
 * @param {Record<string, unknown>} obj2
 */
export function getObjectDiff(obj1, obj2) {
  const diff = {};

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        diff[key] = {
          oldValue: obj1[key],
          newValue: undefined,
          status: "deleted",
        };
      } else if (
        typeof obj1[key] === "object" &&
        obj1[key] !== null &&
        typeof obj2[key] === "object" &&
        obj2[key] !== null
      ) {
        const nestedDiff = getObjectDiff(obj1[key], obj2[key]);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = {
            status: "modified",
            changes: nestedDiff,
          };
        }
      } else if (obj1[key] !== obj2[key]) {
        diff[key] = {
          oldValue: obj1[key],
          newValue: obj2[key],
          status: "modified",
        };
      }
    }
  }

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
        diff[key] = {
          oldValue: undefined,
          newValue: obj2[key],
          status: "added",
        };
      }
    }
  }

  return diff;
}
