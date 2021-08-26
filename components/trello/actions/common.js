const trello = require("../trello.app");

module.exports = {
  props: {
    trello,
  },
  methods: {
    checkValidationResults(validationResults) {
      if (validationResults) {
        const validationErrorMsg = Object.keys(validationResults)
          .map((key) => `\t${validationResults[key]}`)
          .join("\n");
        const errorMsg = `Parameter validation failed with the following errors:\n${validationErrorMsg}`;
        throw new Error(errorMsg);
      }
    },
    convertEmptyStringToUndefined(value) {
      return value === ""
        ? undefined
        : value;
    },
    getMatches(foundObjects, query) {
      const matches = [];
      if (foundObjects) {
        foundObjects.forEach((obj) => {
          if (obj.name.includes(query))
            matches.push(obj);});
      }
      return matches;
    },
    validateFilterOptions(option) {
      return this.getFilterOptions().includes(option);
    },
  },
};
