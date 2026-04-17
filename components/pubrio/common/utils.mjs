/**
 * Parses and validates a JSON string input.
 * @param {string} value - JSON string to parse
 * @param {string} fieldName - Field name for error messages
 * @param {string} expectedType - "object" or "array"
 * @returns {object|Array} Parsed and validated value
 */
function parseJsonField(value, fieldName, expectedType = "object") {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`${fieldName} must be valid JSON`);
  }
  if (expectedType === "array" && !Array.isArray(parsed)) {
    throw new Error(`${fieldName} must be a JSON array`);
  }
  if (expectedType === "object" && (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null)) {
    throw new Error(`${fieldName} must be a JSON object`);
  }
  return parsed;
}

export {
  parseJsonField,
};
