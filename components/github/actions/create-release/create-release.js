const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-release",
  name: "Create Release",
  description: "Create release off a repo.",
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
      description: "By default, `false` to create a published release. Set to `true` to create a draft (unpublished) release.",
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
    const result = await this.github._withRetries(
      () => octokit.repos.createRelease({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        tag_name: this.tag,
        target_commitish: this.targetCommitish,
        name: this.releaseName,
        body: this.body,
        draft: this.draft,
        prerelease: this.prerelease,
        discussion_category_name: this.discussionCategoryName,
      }),
    );
    return result.data;
  },
};
