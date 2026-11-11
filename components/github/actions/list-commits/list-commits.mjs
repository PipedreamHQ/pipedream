import github from "../../github.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "github-list-commits",
  name: "List Commits",
  description: "List commits in a repository, most recent first. Optionally scope to a branch or starting SHA, a file path, an author, or a date range. Provide the repository as an `owner/repo` string. Use **Get Repository** to find the default branch name if needed. [See the documentation](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits)",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullnameStatic",
      ],
    },
    sha: {
      type: "string",
      label: "Branch or SHA",
      description: "Branch name (e.g. `main`) or commit SHA to start listing commits from. Defaults to the repository's default branch.",
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "Only commits containing this file path will be returned",
      optional: true,
    },
    author: {
      type: "string",
      label: "Author",
      description: "GitHub username or email address to use to filter by commit author.",
      optional: true,
    },
    committer: {
      type: "string",
      label: "Committer",
      description: "GitHub username or email address to use to filter by commit committer",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Only show results that were last updated after the given time. This is a timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`",
      optional: true,
    },
    until: {
      type: "string",
      label: "Until",
      description: "Only commits before this date will be returned. This is a timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        github,
        "maxResults",
      ],
      description: `The maximum number of commits to return (1-${constants.MAX_RESULTS_MAX}), e.g. \`50\`. Defaults to \`${constants.DEFAULT_MAX_RESULTS}\`.`,
      min: 1,
      max: constants.MAX_RESULTS_MAX,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const maxResults = this.maxResults || constants.DEFAULT_MAX_RESULTS;
    const commits = await this.github._paginateWithLimit(`GET /repos/${repoFullname}/commits`, maxResults, {
      sha: this.sha,
      path: this.path,
      author: this.author,
      committer: this.committer,
      since: this.since,
      until: this.until,
      per_page: Math.min(maxResults, constants.PER_PAGE_MAX),
    });

    $.export("$summary", `Successfully retrieved ${commits.length} commits${commits.length === maxResults
      ? " (limit reached; more may exist)"
      : ""}.`);

    return commits;
  },
};
