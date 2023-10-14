import github from "../../github.app.mjs";

export default {
  key: "github-create-pull-request",
  name: "Create Pull Request",
  description: "Creates a new pull request for a specified repository. [See docs here](https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request)",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    owner: {
      label: "Owner",
      description: "The account owner of the repository. The name is not case sensitive.",
      type: "string",
    },
    repo: {
      label: "Repository",
      description: "The name of the repository without the .git extension. The name is not case sensitive.",
      type: "string",
    },
    title: {
      label: "Title",
      description: "The title of the new pull request. Required unless issue is specified.",
      type: "string",
    },
    head: {
      label: "Head Branch",
      description: "The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace head with a user like this: username:branch.",
      type: "string",
    },
    base: {
      label: "Base Branch",
      description: "The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.",
      type: "string",
    },
    headRepo: {
      label: "Head Repository",
      description: "The name of the repository where the changes in the pull request were made. This field is required for cross-repository pull requests if both repositories are owned by the same organization.",
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
      description: "Indicates whether maintainers can modify the pull request.",
      type: "boolean",
      optional: true,
    },
    draft: {
      label: "Is Draft",
      description: "Indicates whether the pull request is a draft. See \"Draft Pull Requests\" in the GitHub Help documentation to learn more.",
      type: "boolean",
      optional: true,
    },

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
    };
    const response = await this.github.createRepository({
      data,
    });

    $.export("$summary", `Successfully created repository ${response.full_name}.`);

    return response;
  },
};
