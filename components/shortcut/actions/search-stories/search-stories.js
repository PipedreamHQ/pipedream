const shortcut = require("../../shortcut.app");

module.exports = {
  key: "shortcut-search-stories",
  name: "Search Stories",
  description: "Searches for stories in your Shortcut account.",
  version: "0.0.1",
  type: "action",
  props: {
    shortcut,
    query: {
      type: "string",
      label: "Query",
      description:
        "Enter a search query using Shortcut's supported [search operators](https://help.shortcut.com/hc/en-us/articles/360000046646-Search-Operators).",
    },
    numberOfStories: {
      type: "integer",
      label: "Number of Stories",
      description: "The number of stories to return.",
      default: 25,
    },
  },
  async run({ $ }) {
    return this.shortcut.searchStories(this.query, this.numberOfStories);
  },
};
