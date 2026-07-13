import github from "../../github.app.mjs";

export default {
  key: "github-update-pull-request",
  name: "Update Pull Request",
  description: "Update an existing pull request's title, body, state (`open`/`closed`), or base branch. Only the fields you provide are changed. Provide the repository as an `owner/repo` string and the PR number. If you only know the PR by title, call **Get Pull Request** or **Search Issues and Pull Requests** with `is:pr` first to resolve its number. To merge a PR, use **Merge Pull Request**; to comment on it, use **Create Issue Comment**. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#update-a-pull-request)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    title: {
      label: "Title",
      description: "The new title of the pull request.",
      type: "string",
      optional: true,
    },
    body: {
      label: "Body",
      description: "The new contents of the pull request body. Supports GitHub-flavored Markdown.",
      type: "string",
      optional: true,
    },
    state: {
      label: "State",
      description: "The desired state of the pull request. Set to `closed` to close it without merging, or `open` to reopen.",
      type: "string",
      optional: true,
      options: [
        "open",
        "closed",
      ],
    },
    base: {
      label: "Base Branch",
      description: "The name of the branch you want the changes pulled into, e.g. `main`. Must be an existing branch in the repository.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const data = {
      title: this.title,
      body: this.body,
      state: this.state,
      base: this.base,
    };

    const response = await this.github.updatePullRequest({
      repoFullname,
      pullNumber: this.pullNumber,
      data,
    });

    $.export("$summary", `Successfully updated pull request #${this.pullNumber}`);

    return response;
  },
};
