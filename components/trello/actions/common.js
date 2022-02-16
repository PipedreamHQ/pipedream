const trello = require("../trello.app");

module.exports = {
  props: {
    trello,
  },
  methods: {
    /**
     * Returns a validation message
     *
     * @param {object} validationResults a validation results object from validate.js library
     * @returns it will generate a validation message for each of the validation results present in
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
     * Returns an array of objects that matches the object's `name` property with the `query` param
     *
     * @param {array} foundObjects an array of objects results of a Trello's get
     * endpoint on `labels` and `lists`.
     * @param {string} query the name string that will be use to query against `foundObjects.name`
     * property
     * @returns {array} the objects from `foundObjects` matching the specified query.
     */
    getMatches(foundObjects, query) {
      const matches = [];
      if (foundObjects) {
        foundObjects.forEach((obj) => {
          if (obj.name.includes(query))
            matches.push(obj);});
      }
      return matches;
    },
  },
};
