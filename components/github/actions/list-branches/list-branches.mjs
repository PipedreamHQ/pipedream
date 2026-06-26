import github from "../../github.app.mjs";

export default {
  key: "github-list-branches",
  name: "List Branches",
  description: "List the branches in a repository. Provide the repository as an `owner/repo` string. Optionally filter to only protected (or only unprotected) branches. If you need to discover repository names first, use **List Repositories**. [See the documentation](https://docs.github.com/en/rest/branches/branches#list-branches)",
  version: "1.0.0",
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
        "repoFullnameStatic",
      ],
    },
    protected: {
      type: "boolean",
      label: "Protected",
      description: "Set to `true` to return only branches protected by branch protections or rulesets, or `false` for only unprotected branches. Omit to return all branches.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of branches to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const branches = await this.github.getBranches({
      repoFullname,
      protected: this.protected,
      per_page: this.maxResults,
    });

    $.export("$summary", `Successfully fetched ${branches.length} branch(es)`);

    return branches;
  },
};
