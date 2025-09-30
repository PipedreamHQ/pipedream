import shortcut from "../../shortcut.app.mjs";

export default {
  key: "shortcut-search-stories",
  name: "Search Stories",
  description: "Searches for stories in your Shortcut account.",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shortcut,
    query: {
      type: "string",
      label: "Query",
      description:
        "The search query based on the [Search page](https://help.shortcut.com/hc/en-us/articles/115005967026) [search operators](https://help.shortcut.com/hc/en-us/articles/360000046646-Search-Operators) to use for finding stories.",
    },
    numberOfStories: {
      type: "integer",
      label: "Number of Stories",
      description: "The number of stories to return.",
      default: 25,
    },
  },
  async run() {
    return this.shortcut.searchStories(this.query, this.numberOfStories);
  },
};
