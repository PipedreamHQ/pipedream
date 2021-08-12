/* eslint-disable camelcase */
const { zoho_crm } = require("../zoho_crm.app");

module.exports = {
  props: {
    zoho_crm,
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
  },
};
