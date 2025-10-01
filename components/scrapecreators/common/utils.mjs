export function getObjectDiff(obj1, obj2) {
  const diff = {};

  // Check for differences in obj1's properties
  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        diff[key] = {
          oldValue: obj1[key],
          newValue: undefined,
          status: "deleted",
        };
      } else if (typeof obj1[key] === "object" && obj1[key] !== null &&
                 typeof obj2[key] === "object" && obj2[key] !== null) {
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

  // Check for properties added in obj2
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
