import github from "../../github.app.mjs";

export default {
  key: "github-create-issue-comment",
  name: "Create Issue Comment",
  description: "Create a new comment in a issue. [See docs here](https://docs.github.com/en/rest/issues/comments#create-an-issue-comment)",
  version: "0.0.17",
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
    body: {
      label: "Body",
      description: "The contents of the comment",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.github.createIssueComment({
      repoFullname: this.repoFullname,
      issueNumber: this.issueNumber,
      data: {
        body: this.body,
      },
    });

    $.export("$summary", "Successfully commented in the issue.");

    return response;
  },
};
