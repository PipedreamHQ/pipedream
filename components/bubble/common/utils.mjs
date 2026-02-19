/**
 * Parses constraints that can be either a string or an array of strings/objects
 * @param {string|string[]|object[]} constraints - The constraints to parse
 * @returns {object[]|undefined} Parsed constraints array or undefined
 */
function parseConstraints(constraints) {
  if (!constraints || (Array.isArray(constraints) && constraints.length === 0)) {
    return undefined;
  }

  // If it's a string, try to parse it as JSON
  if (typeof constraints === "string") {
    try {
      const parsed = JSON.parse(constraints);
      // If parsed result is an array, map each item
      if (Array.isArray(parsed)) {
        return parsed.map((item) => typeof item === "string"
          ? JSON.parse(item)
          : item);
      }
      // If it's a single object, wrap in array
      return [
        parsed,
      ];
    } catch (error) {
      throw new Error(`Invalid constraints format: ${error.message}`);
    }
  }

  // If it's already an array
  if (Array.isArray(constraints)) {
    return constraints.map((constraint) => {
      if (typeof constraint === "string") {
        try {
          return JSON.parse(constraint);
        } catch (error) {
          throw new Error(`Invalid constraint JSON: ${error.message}`);
        }
      }
      return constraint;
    });
  }

  // If it's a single object, wrap in array
  return [
    constraints,
  ];
}

/**
 * Parses data/fields that can be either a string or an object
 * @param {string|object} data - The data to parse
 * @returns {object} Parsed data object
 */
function parseData(data) {
  if (!data) {
    return {};
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Invalid data format: ${error.message}`);
    }
  }

  return data;
}

export default {
  parseConstraints,
  parseData,
};
