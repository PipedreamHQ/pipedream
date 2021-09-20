const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-update-release",
  name: "Update Release",
  description: "Update release in a repo.",
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
    release: {
      propDefinition: [
        github,
        "release",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
    },
    tag: {
      propDefinition: [
        github,
        "tag",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
    },
    targetCommitish: {
      propDefinition: [
        github,
        "targetCommitish",
      ],
    },
    releaseName: {
      propDefinition: [
        github,
        "releaseName",
      ],
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
      description: "Text describing the contents of the release.",
    },
    draft: {
      propDefinition: [
        github,
        "draft",
      ],
      description: "By default, `false` for a published release. Set to `true` to make the release a draft.",
    },
    prerelease: {
      propDefinition: [
        github,
        "prerelease",
      ],
    },
    discussionCategoryName: {
      propDefinition: [
        github,
        "discussionCategoryName",
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
      release_id: this.release,
      draft: !!this.draft,
      prerelease: !!this.prerelease,
    };
    if (this.tag) {
      opts.tag_name = this.tag;
    }
    if (this.targetCommitish) {
      opts.target_commitish = this.targetCommitish;
    }
    if (this.releaseName) {
      opts.name = this.releaseName;
    }
    if (this.body) {
      opts.body = this.body;
    }
    if (this.discussionCategoryName) {
      opts.discussion_category_name = this.discussionCategoryName;
    }
    const result = await this.github._withRetries(
      () => octokit.repos.createRelease(opts),
    );
    return result.data;
  },
};
