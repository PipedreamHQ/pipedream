import { toSingleLineString } from "../../common/utils.mjs";
import github from "../../github.app.mjs";

export default {
  key: "github-create-pull-request",
  name: "Create Pull Request",
  description: toSingleLineString(`
  Creates a new pull request for a specified repository.
  [See docs here](https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    github,
    owner: {
      label: "Owner",
      description: toSingleLineString(`
      The account owner of the repository.
      The name is not case sensitive.
      `),
      type: "string",
    },
    repo: {
      label: "Repository Name",
      description: toSingleLineString(`
      The name of the repository without the \`.git\` extension.
      The name is not case sensitive.
      `),
      type: "string",
    },
    head: {
      label: "Head Branch",
      description: toSingleLineString(`
      The name of the branch where your changes are implemented.
      For cross-repository pull requests in the same network, \`namespace\` head with a user like this: \`username:branch\`.
      `),
      type: "string",
    },
    base: {
      label: "Base Branch",
      description: toSingleLineString(`
      The name of the branch you want the changes pulled into.
      This should be an existing branch on the current repository.
      You cannot submit a pull request to one repository that requests a merge to a base of another repository.
      `),
      type: "string",
    },
    headRepo: {
      label: "Head Repository's Name",
      description: toSingleLineString(`
      The name of the repository where the changes in the pull request were made.
      This field is required for cross-repository pull requests if both repositories are owned by the same organization.
      `),
      type: "string",
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
    convertCurrentIssue: {
      type: "string",
      label: "Do you want to convert an issue to a pull request, or create a new pull request?",
      description: toSingleLineString(`
      If you convert an issue to a pull request the issue's title, body, and comments will become the title, body, and comments on the new pull request.
      Otherwise you can manually enter a title, and body for a new pull request.
      `),
      options: [
        "Convert issue to pull request",
        "Create a new pull request",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.convertCurrentIssue === "Convert issue to pull request") {
      props.issue = {
        label: "Issue",
        description: toSingleLineString(`
        An issue in the repository to convert to a pull request.
        The issue title, body, and comments will become the title, body, and comments on the new pull request.
        `),
        type: "integer",
        min: 1,
      };
    } else if (this.convertCurrentIssue === "Create a new pull request") {
      props.title = {
        label: "Title",
        description: "The title of the new pull request.",
        type: "string",
      };
    }

    return props;
  },
  async run({ $ }) {

    const data = {
      owner: this.owner,
      repo: this.repo,
      title: this.title,
      head: this.head,
      base: this.base,
      head_repo: this.headRepo,
      body: this.body,
      maintainer_can_modify: this.maintainerCanModify,
      draft: this.draft,
      issue: this.issue,
    };

    const response = await this.github.createPullRequest({
      owner: this.owner,
      repo: this.repo,
      data: data,
    });

    $.export("$summary", `Successfully created pull request: ${response.title}.`);

    return response;
  },
};
