const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-comment",
  name: "Create Comment",
  description: "Creates a comment on an issue.",
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
      description: "The Github issue where the comment will be created.",
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
      description: "Content of the comment (this field supports [Github markdown](https://docs.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax)).",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.issues.createComment({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        issue_number: this.issue,
        body: this.body,
      }),
    );
    return result.data;
  },
};
