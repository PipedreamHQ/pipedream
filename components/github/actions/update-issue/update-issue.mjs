import github from "../../github.app.mjs";

export default {
  key: "github-update-issue",
  name: "Update Issue",
  description: "Update an existing issue: change its title, body, state (open/closed), labels, assignees, or milestone. Provide the repository as an `owner/repo` string and the issue number. Setting `labels` **replaces** the full label set (it does not append), so include any existing labels you want to keep. Closing an issue is done here by setting `state` to `closed`. Use **Get Issue** first if you need the current values. [See the documentation](https://docs.github.com/en/rest/issues/issues#update-an-issue)",
  version: "0.3.1",
  annotations: {
    destructiveHint: true,
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
    },
    title: {
      label: "Title",
      description: "The new title of the issue.",
      type: "string",
      optional: true,
    },
    body: {
      label: "Body",
      description: "The new text body of the issue. Supports GitHub-flavored Markdown.",
      type: "string",
      optional: true,
    },
    state: {
      label: "State",
      description: "Set the issue to `open` or `closed`.",
      type: "string",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
    labels: {
      label: "Labels",
      description: "Label names for the issue, e.g. `[\"bug\", \"enhancement\"]`. This **replaces** the existing labels — include any you want to keep. Labels must already exist in the repository.",
      type: "string[]",
      optional: true,
    },
    assignees: {
      label: "Assignees",
      description: "GitHub logins to assign to the issue, e.g. `[\"octocat\"]`. Replaces the existing assignees.",
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
      state: this.state,
      labels: this.labels,
      assignees: this.assignees,
      milestone: this.milestoneNumber,
    };

    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.updateIssue({
      repoFullname,
      issueNumber: this.issueNumber,
      data,
    });

    $.export("$summary", `Successfully updated issue #${this.issueNumber}`);

    return response;
  },
};
