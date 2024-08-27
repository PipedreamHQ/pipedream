import { ConfigurationError } from "@pipedream/platform";
import { toSingleLineString } from "../../common/utils.mjs";
import github from "../../github.app.mjs";

export default {
  key: "github-create-pull-request",
  name: "Create Pull Request",
  description: toSingleLineString(`
  Creates a new pull request for a specified repository.
  [See docs here](https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request)
  `),
  version: "0.0.9",
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    head: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      label: "Head Branch",
      description: toSingleLineString(`
      The name of the branch where your changes are implemented.
      For cross-repository pull requests in the same network, \`namespace\` head with a user like this: \`username:branch\`.
      `),
    },
    base: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      label: "Base Branch",
      description: toSingleLineString(`
      The name of the branch you want the changes pulled into.
      This should be an existing branch on the current repository.
      You cannot submit a pull request to one repository that requests a merge to a base of another repository.
      `),
    },
    org: {
      propDefinition: [
        github,
        "orgName",
      ],
      optional: true,
    },
    headRepo: {
      propDefinition: [
        github,
        "repoOrg",
        (c) => ({
          org: c.org,
        }),
      ],
      label: "Head Repository's Name",
      description: toSingleLineString(`
      The name of the repository where the changes in the pull request were made.
      This field is required for cross-repository pull requests if both repositories are owned by the same organization.
      `),
      optional: true,
    },
    body: {
      label: "Body",
      description: "The contents of the pull request.",
      type: "string",
      optional: true,
    },
    maintainerCanModify: {
      label: "Maintainer Can Modify",
      description: "Indicates whether [maintainers can modify](https://docs.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) the pull request.",
      type: "boolean",
      optional: true,
    },
    draft: {
      label: "Is Draft",
      description: toSingleLineString(`
      Indicates whether the pull request is a draft.
      See "[Draft Pull Requests](https://docs.github.com/articles/about-pull-requests#draft-pull-requests)" in the GitHub Help documentation to learn more.
      `),
      type: "boolean",
      optional: true,
    },
    title: {
      label: "Title",
      description: "The title of the new pull request.",
      type: "string",
      optional: true,
    },
    issue: {
      propDefinition: [
        github,
        "issueNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      label: "Issue",
      description: toSingleLineString(`
        An issue in the repository to convert to a pull request.
        The issue title, body, and comments will become the title, body, and comments on the new pull request.
        `),
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {

    if (!this.issue && !this.title) {
      throw new ConfigurationError(toSingleLineString(`
      Title is required if Issue is unspecified.
      You can either specify a new pull request with Title or convert an existing issue to a pull request with Issue.
      `));
    }

    if (this.issue && this.title) {
      throw new ConfigurationError("You can't specify both Title and Issue at the same time.");
    }

    const data = {
      title: this.title,
      head: this.head.split("/")[1],
      base: this.base.split("/")[1],
      head_repo: this.headRepo,
      body: this.body,
      maintainer_can_modify: this.maintainerCanModify,
      draft: this.draft,
      issue: this.issue,
    };

    const response = await this.github.createPullRequest({
      owner: this.owner,
      repoFullname: this.repoFullname,
      data: data,
    });

    $.export("$summary", `Successfully created pull request: ${response.title}.`);

    return response;
  },
};
