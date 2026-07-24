import github from "../../github.app.mjs";

export default {
  key: "github-get-pull-request-files",
  name: "Get Pull Request Files",
  description: "List the files changed in a pull request (the PR diff at the file level). Returns each file's `filename`, `status` (added/modified/removed/renamed), additions/deletions/changes counts, and the unified `patch` when available — use this to review what a PR changes before approving or merging it. Provide the repository as an `owner/repo` string and the PR number. If you only know the PR by title, call **Get Pull Request** or **Search Issues and Pull Requests** with `is:pr` first to resolve its number. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#list-pull-requests-files)",
  version: "0.0.1",
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
    pullNumber: {
      propDefinition: [
        github,
        "pullNumberStatic",
      ],
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const files = await this.github.getPullRequestFiles({
      repoFullname,
      pullNumber: this.pullNumber,
    });

    $.export("$summary", `Retrieved ${files.length} changed file(s) for pull request #${this.pullNumber}`);

    return files;
  },
};
