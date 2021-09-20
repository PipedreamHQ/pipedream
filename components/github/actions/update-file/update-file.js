const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-update-file",
  name: "Update File",
  description: "Update file in a Github repo.",
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
    },
    message: {
      propDefinition: [
        github,
        "commitMessage",
      ],
    },
    content: {
      propDefinition: [
        github,
        "content",
      ],
      description: "The file content in base64 encoded format.",
    },
    committerName: {
      propDefinition: [
        github,
        "committerName",
      ],
    },
    committerEmail: {
      propDefinition: [
        github,
        "committerEmail",
      ],
    },
    commitDate: {
      propDefinition: [
        github,
        "commitDate",
      ],
    },
    authorName: {
      propDefinition: [
        github,
        "authorName",
      ],
    },
    authorEmail: {
      propDefinition: [
        github,
        "authorEmail",
      ],
    },
    authorDate: {
      propDefinition: [
        github,
        "authorDate",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const opts = {
      owner: this.repoFullName.split("/")[0],
      repo: this.repoFullName.split("/")[1],
      path: `${this.contentPath}/${this.contentFile.split("-")[0]}`,
      message: this.message,
      content: this.content,
      branch: this.branch,
      sha: this.contentFile.split("-")[1],
    };
    if (this.committerName && this.committerEmail) {
      opts.committer = {
        name: this.committerName,
        email: this.committerEmail,
      };
      if (this.commitDate) {
        opts.committer.date = !!this.commitDate || Date.UTC();
      }
    }
    if (this.authorName && this.authorEmail) {
      opts.author = {
        name: this.authorName,
        email: this.authorEmail,
      };
    }
    const result = await this.github._withRetries(
      () =>  octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", opts),
    );
    return result.data;
  },
};
