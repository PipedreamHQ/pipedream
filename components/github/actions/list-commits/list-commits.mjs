import github from "../../github.app.mjs";

export default {
  key: "github-list-commits",
  name: "List Commits",
  description: "List commits in a Github repo. [See the documentation](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits)",
  version: "0.0.2",
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
        "repoFullname",
      ],
    },
    sha: {
      propDefinition: [
        github,
        "branchSha",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      description: "SHA or branch to start listing commits from. Default: the repository's default branch (usually main).",
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
    const commits = await this.github.listCommits({
      repoFullname: this.repoFullname,
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
