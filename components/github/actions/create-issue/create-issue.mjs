import dannyGitHubTest from "../../github.app.mjs";

export default {
  key: "github-create-issue",
  name: "Create Issue",
  description: "Create a new issue in a Gihub repo. [See docs here](https://docs.github.com/en/rest/issues/issues#create-an-issue)",
  version: "0.2.12",
  type: "action",
  props: {
    dannyGitHubTest,
    repoFullname: {
      propDefinition: [
        dannyGitHubTest,
        "repoFullname",
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
        dannyGitHubTest,
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
        dannyGitHubTest,
        "collaborators",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dannyGitHubTest.createIssue({
      repoFullname: this.repoFullname,
      data: {
        title: this.title,
        body: this.body,
        labels: this.labels,
        assignees: this.assignees,
      },
    });

    $.export("$summary", `Successfully created a new issue: "[${response.title}](${response.html_url})".`);

    return response;
  },
};
