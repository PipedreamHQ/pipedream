import github from "../../github.app.mjs";

export default {
  key: "github-create-issue-comment",
  name: "Create Issue Comment",
  description: "Add a comment to an existing issue **or pull request** (GitHub treats PRs as issues for comments, so the same `number` works for both). Provide the repository as an `owner/repo` string, the issue/PR number, and the comment body. If you only know the issue/PR by title, call **Search Issues and Pull Requests** first to resolve its number. [See the documentation](https://docs.github.com/en/rest/issues/comments#create-an-issue-comment)",
  version: "0.1.0",
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
    issueNumber: {
      propDefinition: [
        github,
        "issueNumberStatic",
      ],
      label: "Issue or PR Number",
      description: "The number of the issue or pull request to comment on.",
    },
    body: {
      label: "Body",
      description: "The contents of the comment. Supports GitHub-flavored Markdown.",
      type: "string",
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.createIssueComment({
      repoFullname,
      issueNumber: this.issueNumber,
      data: {
        body: this.body,
      },
    });

    $.export("$summary", "Successfully commented in the issue.");

    return response;
  },
};
