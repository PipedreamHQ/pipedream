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
  },
};
