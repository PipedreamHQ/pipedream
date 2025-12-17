import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";

export default {
  key: "github-create-pull-request",
  name: "Create Pull Request",
  description: "Creates a new pull request for a specified repository. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      label: "Base Repository",
      description: "The base repository, where the pull request will be created.",
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
      description: "The base branch, where the changes will be received.",
    },
    headRepo: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      label: "Head Repository",
      description: "The head repository, where the changes originate from. This can, but does not have to, be the same repository.",
    },
    head: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.headRepo,
        }),
      ],
      label: "Head Branch",
      description: "The head branch, where the changes originate from",
    },
    body: {
      label: "Body",
      description: "The text description of the pull request.",
      type: "string",
      optional: true,
    },
    maintainerCanModify: {
      label: "Maintainers Can Modify",
      description: "Indicates whether [maintainers can modify](https://docs.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) the pull request.",
      type: "boolean",
      optional: true,
    },
    draft: {
      label: "Is Draft",
      description: "Indicates whether the pull request is a draft. See \"[Draft Pull Requests](https://docs.github.com/articles/about-pull-requests#draft-pull-requests)\" in the GitHub Help documentation to learn more.",
      type: "boolean",
      optional: true,
    },
    title: {
      label: "Title",
      description: "The title of the pull request.",
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
      description: "An issue in the repository to convert to a pull request. The issue title, body, and comments will become the title, body, and comments on the new pull request.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {

    if (!this.issue && !this.title) {
      throw new ConfigurationError("Title is required if Issue is unspecified. You can either specify a new pull request with Title or convert an existing issue to a pull request with Issue.");
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
