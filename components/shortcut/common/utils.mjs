const parseJson = (input, maxDepth = 100) => {
  const seen = new WeakSet();
  const parse = (value) => {
    if (maxDepth <= 0) {
      return value;
    }
    if (typeof(value) === "string") {
      // Only parse if the string looks like a JSON object or array
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          return parseJson(JSON.parse(value), maxDepth - 1);
        } catch (e) {
          return value;
        }
      }
      return value;
    } else if (typeof(value) === "object" && value !== null && !Array.isArray(value)) {
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      return Object.entries(value)
        .reduce((acc, [
          key,
          val,
        ]) => Object.assign(acc, {
          [key]: parse(val),
        }), {});
    } else if (Array.isArray(value)) {
      return value.map((item) => parse(item));
    }
    return value;
  };

  return parse(input);
};

export default {
  /**
     * Returns a validation message
     *
     * @param {object} validationResults a validation results object from validate.js library
     * @returns it will generate validation message for each of the validation results present in
     * `validationResults`.
     */
  checkValidationResults(validationResults) {
    if (validationResults) {
      const validationErrorMsg = Object.keys(validationResults)
        .map((key) => `\t${validationResults[key]}`)
        .join("\n");
      const errorMsg = `Parameter validation failed with the following errors:\n${validationErrorMsg}`;
      throw new Error(errorMsg);
    }
  },
  /**
     * Returns `undefined` when `value` is an empty string or `null`.
     *
     * @param {object} value the value to check for returning `null`.
     * @returns If `value` is defined, it will return `value`. Otherwise on an empty string, or
     * `null` it will return `undefined`.
     */
  convertEmptyStringToUndefined(value) {
    return value || undefined;
  },
  /**
     * * Returns a constraint for `validate.js` library to validate for array if needed.
     *
     * @param {object} value the value to check if an array should be validated.
     * @returns A constraint for `validate.js` library to validate for arrays if `value`
     * is provided. When `value` is `null` or `undefined` no constraint is returned.
     */
  validateArrayWhenPresent(value) {
    if (value === null || value === undefined) {
      return;
    }
    return {
      type: "array",
    };
  },
  parseJson,
};
