const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-check-organization-membership",
  name: "Check Organization Membership",
  description: "Checks if a user is, publicly or privately, a member of the organization.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    org: {
      propDefinition: [
        github,
        "org",
      ],
    },
    user: {
      propDefinition: [
        github,
        "user",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const response = await this.github._withRetries(
      () => octokit.orgs.checkPublicMembershipForUser({
        org: this.org,
        username: this.user,
      }),
    );
    return response.status == 204 || response.status == 302;
  },
};
