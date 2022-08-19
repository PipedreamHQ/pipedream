import common from "../common/base-search.mjs";

export default {
  ...common,
  key: "notion-search",
  name: "Search",
  description: "Searches for a page or database. [See the docs](https://developers.notion.com/reference/post-search)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    title: {
      propDefinition: [
        common.props.notion,
        "title",
      ],
      label: "Query",
      description: "The object title.",
    },
    filter: {
      propDefinition: [
        common.props.notion,
        "filter",
      ],
    },
  },
  methods: {
    getSummary({
      response, title,
    }) {
      return `Found ${response.results.length} object${response.results.length > 1
        ? "s"
        : ""} ${title
        ? `with query search ${this.title}`
        : ""}`;
    },
    getFilter() {
      return this.filter;
    },
  },
};
