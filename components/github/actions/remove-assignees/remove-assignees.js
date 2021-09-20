const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-remove-assignees-from-issue",
  name: "Remove Assignee(s) from an Issue",
  description: "Remove Assignee(s) from an Issue",
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
      description: "The Github issue where assignee(s) will be removed from.",
    },
    assignees: {
      propDefinition: [
        github,
        "issueAssignees",
      ],
      description: "The Github usernames of the assignees to remove from this issue. Add one username per row or disable structured mode to pass an array of usernames in `{{...}}`. NOTE: Only users with push access can set assignees for new issues. Assignees are silently dropped otherwise.",
      optional: false,
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const opts = {
      owner: this.repoFullName.split("/")[0],
      repo: this.repoFullName.split("/")[1],
      issue_number: this.issue,
      assignees: this.assignees,
    };
    const result = await this.github._withRetries(
      () => octokit.issues.removeAssignees(opts),
    );
    return result.data;
  },
};
