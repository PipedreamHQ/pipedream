import github from "../../github.app.mjs";

export default {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Find issues and pull requests by state and keyword.",
  version: "0.1.0",
  type: "action",
  props: {
    github,
    query: {
      label: "Query",
      description: "The query contains one or more search keywords and qualifiers",
      type: "string",
    },
    paginate: {
      label: "Paginate",
      description: "By default, retrieve all matching search results across all result pages. Set to `false` to limit results to the first page.",
      type: "boolean",
      default: true,
      optional: true,
    },
  },
  async run() {
    return this.github.searchIssueAndPullRequests({
      query: this.query,
      paginate: this.paginate,
    });
  },
};
