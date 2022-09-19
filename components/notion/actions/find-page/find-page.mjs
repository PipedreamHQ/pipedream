import common from "../common/base-search.mjs";

export default {
  ...common,
  key: "notion-find-page",
  name: "Find a Page",
  description: "Searches for a page by its title. [See the docs](https://developers.notion.com/reference/post-search)",
  version: "0.0.3",
  type: "action",
  methods: {
    getSummary({
      response, title,
    }) {
      return `Found ${response.results.length} pages ${title
        ? `with title search ${this.title}`
        : ""}`;
    },
    getFilter() {
      return "page";
    },
  },
};
