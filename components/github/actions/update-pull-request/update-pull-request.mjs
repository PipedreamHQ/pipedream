import github from "../../github.app.mjs";

export default {
  key: "github-update-pull-request",
  name: "Update Pull Request",
  description: "Updates an existing pull request with new title, body, state, or base branch. [See the documentation](https://docs.github.com/en/rest/pulls/pulls#update-a-pull-request)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      label: "Repository",
      description: "The repository where the pull request exists.",
    },
    pullNumber: {
      propDefinition: [
        github,
        "pullNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      label: "Pull Request Number",
      description: "The number of the pull request to update.",
    },
    title: {
      label: "Title",
      description: "The title of the pull request.",
      type: "string",
      optional: true,
    },
    body: {
      label: "Body",
      description: "The contents of the pull request body. Supports markdown.",
      type: "string",
      optional: true,
    },
    state: {
      label: "State",
      description: "The desired state of the pull request.",
      type: "string",
      optional: true,
      options: [
        "open",
        "closed",
      ],
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
      description: "The name of the branch you want your changes pulled into. This should be an existing branch on the current repository.",
      optional: true,
    },
    maintainerCanModify: {
      label: "Maintainers Can Modify",
      description: "Indicates whether [maintainers can modify](https://docs.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) the pull request.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      github,
      repoFullname,
      pullNumber,
      title,
      body,
      state,
      base,
      maintainerCanModify,
    } = this;

    const data = {};

    if (title) {
      data.title = title;
    }

    if (body) {
      data.body = body;
    }

    if (state) {
      data.state = state;
    }

    if (base) {
      // Extract branch name from the branch prop format (sha/branchname)
      data.base = base.split("/")[1];
    }

    // Only include maintainer_can_modify if explicitly set to true
    // This field only applies to cross-repo pull requests (from forks)
    if (maintainerCanModify === true) {
      data.maintainer_can_modify = maintainerCanModify;
    }

    const response = await github.updatePullRequest({
      repoFullname,
      pullNumber,
      data,
    });

    $.export("$summary", `Successfully updated pull request with ID \`${response.id}\``);

    return response;
  },
};
