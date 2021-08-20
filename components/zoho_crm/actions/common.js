module.exports = {
  props: {
    zoho_crm: require("../zoho_crm.app"),
  },
  methods: {
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
     * Checks if an object is an array, if not it will attempt to JSON parse.
     * If the object is not defined it will return undefined.
     * @param {object} object the input object to check for array type or JSON parse.
     * @returns The same object, if it's an array, otherwise the "JSON.parsed" object.
     */
    getArrayObject(obj) {
      obj = obj || undefined;
      if (obj) {
        return Array.isArray(obj) ?
          obj :
          JSON.parse(obj);
      } else {
        return undefined;
      }
    },
    /**
     * This method iterates over the generator results returned by the `searchRecords` method and
     *  generates an array with all the search records yielded.
     * @params {String} generator - A generator object from the `searchRecords` method.
     * @returns { validationMessages: string } String with validation messages concatenated, if the
     * input had multiple validation messages, or one validation message when the validation had
     * one result.
     */
    async getGeneratorResults(generator) {
      const results = [];
      let result;
      do {
        result = await generator.next();
        if (result.value) {
          results.push(result.value);
        }
      } while (!result.done);
      return results;
    },
    /**
     * Checks if an object is an array or an JSON array string, returns an error message when the
     * check fails.
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
  },
};
