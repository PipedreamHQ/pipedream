import github from "../../github.app.mjs";

export default {
  key: "github-list-commits",
  name: "List Commits",
  description: "List commits in a repository, most recent first. Optionally scope to a branch or starting SHA, a file path, an author, or a date range. Provide the repository as an `owner/repo` string. Use **Get Repository** to find the default branch name if needed. [See the documentation](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const commits = await this.github.listCommits({
      repoFullname,
      sha: this.sha,
      path: this.path,
      author: this.author,
      committer: this.committer,
      since: this.since,
      until: this.until,
      per_page: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${commits.length} commits.`);

    return commits;
  },
};
