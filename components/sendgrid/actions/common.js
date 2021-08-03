const sendgrid = require("../sendgrid.app");

module.exports = {
  props: {
    sendgrid,
  },
  methods: {
    /**
     * Gets a validation constraint for integer values greater than 0 to use with the
     * `validation.js` library.
     *
     * @returns {{onlyInteger: boolean, greaterThan: integer, message: string} numericality}
     * structure of the validation constraint for integer values greater than 0.
     */
    getIntegerGtZeroConstraint() {
      return {
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          message: "must be positive integer, greater than zero.",
        },
      };
    },
    /**
     * Checks if an object is an array or an JSON array string, returns an error message when the
     * fails.
     *
     * @param {object} value the object to check for array or JSON array string.
     * @param {string} key a name of the object being checked that will be used in the result
     * message.
     * @returns {arrayValidatorMsg: string} the validation error if `value` is not an array, nor
     * a JSON array string. Otherwise returns `null`.
     */
    validateArray(value, params) {
      const arrayValidatorMsgFormat = "parameter must be an array of % objects or an string that will `JSON.parse` to an array of & objects.";
      let arrayValidatorMsg = arrayValidatorMsgFormat.replace("%", params.key);
      arrayValidatorMsg = arrayValidatorMsg.replace("&", params.key);
      if (Array.isArray(value)) {
        return null;
      } else {
        try {
          const parsedValue = JSON.parse(value);
          return Array.isArray(parsedValue) ?
            null :
            arrayValidatorMsg;
        } catch {
          return arrayValidatorMsg;
        }
      }
    },
    /**
     * Returns a validation message
     *
     * @param {object} validationResults a validation results object from validate.js library
     * @returns tt will generate validation message for each of the validation results present in
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
     * Returns `null` when `value` is an empty string or `undefined`.
     *
     * @param {object} value the value to check for returning `null`.
     * @returns If `value` is defined, it will return `value`. Otherwise on an empty string, or
     * `undefined` it will return `null`.
     */
    convertEmptyStringToNull(value) {
      return value || null;
    },
    /**
     * Checks if an object is an array, if not it will attempt to JSON parse.
     *
     * @param {object} object the input object to check for array type or JSON parse.
     * @returns The same object, if it's an array, otherwise the "JSON.parsed" object.
     */
    getArrayObject(object) {
      return Array.isArray(object) ?
        object :
        JSON.parse(object);
    },
  },
};
