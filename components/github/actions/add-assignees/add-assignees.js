const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-add-assignees-to-issue",
  name: "Add Assignee(s) to Issue",
  description: "Add Assignee(s) to Issue",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
    issue: {
      propDefinition: [
        github,
        "issue",
        (c) => (
          {
            repoFullName: c.repoFullName,
          }
        ),
      ],
      description: "The Github issue where assignee(s) will be added to.",
    },
    assignees: {
      propDefinition: [
        github,
        "issueAssignees",
      ],
      description: "Github usernames to assign to this issue. Add one username per row or disable structured mode to pass an array of usernames in `{{...}}`. NOTE: Only users with push access can set assignees for new issues. Assignees are silently dropped otherwise.",
      optional: false,
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.issues.addAssignees({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        issue_number: this.issue,
        assignees: this.assignees,
      }),
    );
    return result.data;
  },
};
