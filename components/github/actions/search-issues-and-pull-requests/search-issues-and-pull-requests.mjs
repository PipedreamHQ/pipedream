import github from "../../github.app.mjs";

export default {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Find issues and pull requests by state and keyword. [See the documentation](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)",
  version: "0.2.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    infoBox: {
      type: "alert",
      alertType: "info",
      content: `Example query: \`bug report in:title type:issue repo:octocat/Hello-World\`
      
This will return issues in the repository [octocat/Hello-World](https://github.com/octocat/Hello-World) with the title including the words "bug report".`,
    },
    query: {
      label: "Query",
      description: "The query contains one or more search keywords and qualifiers. [See the documentation](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests) for more information and examples",
      type: "string",
      default: "repo:pipedreamhq/pipedream is:pr is:open sort:updated-desc",
    },
    maxResults: {
      label: "Maximum Results",
      description: "The maximum amount of items to retrieve",
      type: "integer",
      default: 5,
    },
  },
  async run({ $ }) {
    const response = await this.github.searchIssueAndPullRequests({
      query: this.query,
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully fetched ${response.length} items`);
    return response;
  },
};
