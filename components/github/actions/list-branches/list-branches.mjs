import github from "../../github.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "github-list-branches",
  name: "List Branches",
  description: "List branches for a repository using its `owner/repo` full name (for example, `octocat/Hello-World`). If you need to discover repository names first, use **List Repositories**. [See the documentation](https://docs.github.com/en/rest/branches/branches?apiVersion=2026-03-10#list-branches)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    protected: {
      type: "boolean",
      label: "Protected",
      description: "Setting to `true` returns only branches protected by branch protections or rulesets. When set to `false`, only unprotected branches are returned. Omitting this parameter returns all branches.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number of the results to return. Defaults to 1.",
      default: 1,
      min: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of results to return per page. Defaults to 30. Maximum is 100.",
      default: 30,
      max: 100,
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.page < 1 || this.perPage < 1) {
      throw new ConfigurationError("Page and Per Page must be greater than 0");
    }

    if (this.perPage > 100) {
      throw new ConfigurationError("Per Page must be less than or equal to 100");
    }

    const branches = await this.github.getBranches({
      repoFullname: this.repoFullname,
      protected: this.protected,
      page: this.page,
      per_page: this.perPage,
    });
    $.export("$summary", `Successfully fetched ${branches.length} branches`);
    return branches;
  },
};
