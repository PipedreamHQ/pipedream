import github from "../../github.app.mjs";

export default {
  key: "github-merge-pull-request",
  name: "Merge Pull Request",
  description: "Merge an open pull request into its base branch. Choose the `mergeMethod`: `merge` (a merge commit, the default), `squash` (combine all commits into one), or `rebase`. The merge fails if the PR is not mergeable (conflicts, failing required checks, or required reviews missing) — check mergeable state and CI with **Get Pull Request** first. Provide the repository as an `owner/repo` string and the PR number. To create the PR first, use **Create Pull Request**. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#merge-a-pull-request)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    mergeMethod: {
      type: "string",
      label: "Merge Method",
      description: "How to merge the pull request. Defaults to `merge`.",
      options: [
        "merge",
        "squash",
        "rebase",
      ],
      default: "merge",
      optional: true,
    },
    commitTitle: {
      type: "string",
      label: "Commit Title",
      description: "Title for the merge commit. Defaults to GitHub's automatic title.",
      optional: true,
    },
    commitMessage: {
      type: "string",
      label: "Commit Message",
      description: "Extra detail appended to the merge commit message.",
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const data = {
      merge_method: this.mergeMethod,
      commit_title: this.commitTitle,
      commit_message: this.commitMessage,
    };

    const response = await this.github.mergePullRequest({
      repoFullname,
      pullNumber: this.pullNumber,
      data,
    });

    $.export("$summary", `Merged pull request #${this.pullNumber}${response?.merged
      ? ` (${response.sha})`
      : ""}`);

    return response;
  },
};
