const clubhouse = require("../../clubhouse.app.js");
const validate = require("validate.js");

module.exports = {
  key: "clubhouse-search-stories",
  name: "Search Stories",
  description: "Searches for stories in your clubhouse.",
  version: "0.0.1",
  type: "action",
  props: {
    clubhouse,
    query: {
      type: "string",
      label: "Query",
      description:
        "The search query based on the [Search page](https://help.clubhouse.io/hc/en-us/articles/115005967026) [search operators](https://help.clubhouse.io/hc/en-us/articles/360000046646-Search-Operators) to use for finding stories.",
    },
    numberOfStories: {
      type: "integer",
      label: "Number of Stories",
      description: "The number of stories to return.",
      default: 25,
    },
  },
  async run() {
    const constraints = {
      query: {
        presence: true,
      },
      numberOfStories: {
        presence: true,
        type: "integer",
      },
    };
    const validationResult = validate(
      {
        query: this.query,
        numberOfStories: this.numberOfStories,
      },
      constraints,
    );
    this.clubhouse.checkValidationResults(validationResult);
    return await this.clubhouse.searchStories(this.query, this.numberOfStories);
  },
};
