import github from "../../github.app.mjs";

export default {
  key: "github-list-branches",
  name: "List Branches",
  description: "List branches for a repository. [See the documentation](https://docs.github.com/en/rest/branches/branches?apiVersion=2026-03-10#list-branches)",
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
    page: {
      type: "integer",
      label: "Page",
      description: "The page number of the results to return. Defaults to 1.",
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of results to return per page. Defaults to 30. Maximum is 100.",
      default: 30,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const branches = await this.github.getBranches({
      repoFullname: this.repoFullname,
      page: this.page,
      per_page: this.perPage,
    });
    $.export("$summary", `Successfully fetched ${branches.length} branches`);
    return branches;
  },
};
