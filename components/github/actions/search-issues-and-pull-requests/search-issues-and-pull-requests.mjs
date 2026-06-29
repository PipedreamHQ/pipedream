import github from "../../github.app.mjs";

export default {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Search issues and pull requests across GitHub using the issues-search query DSL. This is the escape hatch for finding items by keyword, state, label, author, or assignee when you don't already know the issue/PR number. "
    + "Build the `query` from space-separated qualifiers: `repo:owner/name` to scope to one repo (a bare `repo:name` with no owner is auto-resolved to your own account), `is:issue`/`is:pr`, `is:open`/`is:closed`, `label:bug`, `author:octocat`, `assignee:octocat`, `in:title`/`in:body`, and free-text keywords. "
    + "Example: `repo:PipedreamHQ/pipedream is:issue is:open label:bug raptor`. "
    + "Returns matching items (each with `number`, `title`, `state`, `labels`, `html_url`); feed a result's `number` into **Get Issue**, **Get Pull Request**, or **Create Issue Comment**. [See the query syntax](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    query: {
      label: "Query",
      description: "The search query built from keywords and qualifiers. Example: `repo:PipedreamHQ/pipedream is:pr is:open sort:updated-desc`. [See the documentation](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests) for the full qualifier list.",
      type: "string",
    },
    maxResults: {
      label: "Maximum Results",
      description: "The maximum number of items to retrieve. Defaults to `30`.",
      type: "integer",
      default: 30,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = await this.github._resolveSearchQuery(this.query);
    const response = await this.github.searchIssueAndPullRequests({
      query,
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully fetched ${response.length} item${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
