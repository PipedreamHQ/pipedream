const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-get-file",
  name: "Get File",
  description: "Get file in a Github repo.",
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
    branch: {
      propDefinition: [
        github,
        "branch",
        (c) => (
          {
            repoFullName: c.repoFullName,
          }
        ),
      ],
      description:
          "The branch name. Default: `master`.",
      default: "master",
    },
    contentPath: {
      propDefinition: [
        github,
        "contentPath",
        (c) => ({
          repoFullName: `${c.repoFullName}`,
          ref: c.branch,
        }),
      ],
    },
    contentFile: {
      propDefinition: [
        github,
        "contentFile",
        (c) => ({
          repoFullName: `${c.repoFullName}`,
          ref: c.branch,
          path: c.contentPath,
        }),
      ],
      description: "File to get details.",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () =>  octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        path: `${this.contentPath}/${this.contentFile.split("-")[0]}`,
        ref: this.branch,
      }),
    );
    return result.data;
  },
};
