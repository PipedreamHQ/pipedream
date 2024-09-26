import github from "../../github.app.mjs";

export default {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Find issues and pull requests by state and keyword. [See docs here](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)",
  version: "0.1.16",
  type: "action",
  props: {
    github,
    query: {
      label: "Query",
      description: "The query contains one or more search keywords and qualifiers",
      type: "string",
    },
    maxResults: {
      label: "Maximum Results",
      description: "The maximum of resources that will be returned",
      type: "integer",
      default: 100,
    },
  },
  async run() {
    return this.github.searchIssueAndPullRequests({
      query: this.query,
      maxResults: this.maxResults,
    });
  },
};
