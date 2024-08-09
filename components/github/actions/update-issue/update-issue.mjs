import github from "../../github.app.mjs";

export default {
  key: "github-update-issue",
  name: "Update Issue",
  description: "Update a new issue in a Gihub repo. [See docs here](https://docs.github.com/en/rest/issues/issues#update-an-issue)",
  version: "0.1.16",
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
    title: {
      label: "Title",
      description: "The title of the issue",
      type: "string",
    },
    body: {
      label: "Body",
      description: "The contents of the issue",
      type: "string",
      optional: true,
    },
    labels: {
      label: "Labels",
      description: "Labels to associate with this issue. NOTE: Only users with push access can set labels for new issues",
      optional: true,
      propDefinition: [
        github,
        "labels",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
    assignees: {
      label: "Assignees",
      description: "Logins for Users to assign to this issue. NOTE: Only users with push access can set assignees for new issues",
      optional: true,
      propDefinition: [
        github,
        "collaborators",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.github.updateIssue({
      repoFullname: this.repoFullname,
      issueNumber: this.issueNumber,
      data: {
        title: this.title,
        body: this.body,
        labels: this.labels,
        assignees: this.assignees,
      },
    });

    $.export("$summary", "Successfully created issue.");

    return response;
  },
};
