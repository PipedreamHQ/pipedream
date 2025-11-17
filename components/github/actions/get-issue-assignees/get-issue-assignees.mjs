import github from "../../github.app.mjs";

export default {
  key: "github-get-issue-assignees",
  name: "Get Issue Assignees",
  description: "Get assignees for an issue in a GitHub repo. [See the documentation](https://docs.github.com/en/rest/issues/issues#get-an-issue)",
  version: "0.0.24",
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
    issueNumber: {
      label: "Issue Number",
      description: "The number that identifies the issue.",
      type: "integer",
      propDefinition: [
        github,
        "issueNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const issue = await this.github.getIssue({
      repoFullname: this.repoFullname,
      issueNumber: this.issueNumber,
    });

    $.export("$summary", "Successfully found issue.");
    $.export("issue", issue);

    return issue.assignees.map((assignee) => assignee.login);
  },
};
