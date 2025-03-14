import common from "../common/base-search.mjs";

export default {
  ...common,
  key: "notion-search",
  name: "Find Pages or Databases",
  description: "Searches for a page or database. [See the documentation](https://developers.notion.com/reference/post-search)",
  version: "0.0.6",
  type: "action",
  props: {
    ...common.props,
    title: {
      type: "string",
      label: "Query (Title)",
      description: "The object title to search for",
    },
    filter: {
      propDefinition: [
        common.props.notion,
        "filter",
      ],
    },
  },
  methods: {
    getSummary({ response }) {
      return `Found ${response.results?.length} object${response.results?.length === 1
        ? ""
        : "s"} with query search ${this.title}`;
    },
    getFilter() {
      return this.filter;
    },
  },
};
