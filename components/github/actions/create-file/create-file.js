const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-file",
  name: "Create File",
  description: "Create file in a Github repo.",
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
    fileName: {
      type: "string",
      label: "File",
      description: "The file to create.",
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
      path: `${this.contentPath}/${this.fileName}`,
      message: this.message,
      content: this.content,
      branch: this.branch,
    };
    if (this.sha) {
      opts.sha = this.sha;
    }
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
