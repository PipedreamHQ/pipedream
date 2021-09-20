const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-pull-request",
  name: "Create Pull Request",
  description: "Creates a pull request on a Github repo.",
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
    title: {
      propDefinition: [
        github,
        "issueTitle",
      ],
      description: "The title of the pull request.",
      optional: true,
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
      description: "The contents of the pull request.",
    },
    head: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      label: "Head",
      description:
        "The name of the branch where changes are implemented.",
    },
    base: {
      propDefinition: [
        github,
        "branch",
        (c) => (
          {
            repoFullName: c.repoFullName,
          }
        ),
      ],
      label: "Base",
      description:
        "The name of the branch where changes are to be pulled into.",
    },
    maintainer_can_modify: {
      type: "boolean",
      label: "Maintainers Can Modify",
      description: "By default, [maintainers can modify](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) the pull request.",
      optional: true,
      default: true,
    },
    draft: {
      propDefinition: [
        github,
        "draft",
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
      title: this.title,
      body: this.body,
      head: this.head,
      base: this.base,
      maintainer_can_modify: this.maintainer_can_modify,
      draft: this.draft,
    };
    const result = await this.github._withRetries(
      () =>  octokit.pulls.create(opts),
    );
    return result.data;
  },
};
