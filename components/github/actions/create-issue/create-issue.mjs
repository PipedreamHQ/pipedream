import github from "../../github.app.mjs";

export default {
  key: "github-create-issue",
  name: "Create Issue",
  description: "Create a new issue in a repository, optionally with labels, assignees, and a milestone. Provide the repository as an `owner/repo` string. Labels and assignees are passed by name/login (e.g. `bug`, `octocat`) — setting them requires push access to the repo. To comment on an existing issue instead, use **Create Issue Comment**; to change an existing issue, use **Update Issue**. [See the documentation](https://docs.github.com/en/rest/issues/issues#create-an-issue)",
  version: "0.4.0",
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
    title: {
      label: "Title",
      description: "The title of the issue.",
      type: "string",
    },
    body: {
      label: "Body",
      description: "The text body of the issue. Supports GitHub-flavored Markdown.",
      type: "string",
      optional: true,
    },
    labels: {
      label: "Labels",
      description: "Label names to add to the issue, e.g. `[\"bug\", \"enhancement\"]`. Labels must already exist in the repository. Requires push access.",
      type: "string[]",
      optional: true,
    },
    assignees: {
      label: "Assignees",
      description: "GitHub logins to assign to the issue, e.g. `[\"octocat\"]`. Requires push access.",
      type: "string[]",
      optional: true,
    },
    milestoneNumber: {
      label: "Milestone Number",
      description: "The number of an existing milestone to associate with the issue.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      body: this.body,
      labels: this.labels,
      assignees: this.assignees,
      milestone: this.milestoneNumber,
    };

    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.createIssue({
      repoFullname,
      data,
    });

    $.export("$summary", `Successfully created issue #${response.number}: ${response.title}`);

    return response;
  },
};
