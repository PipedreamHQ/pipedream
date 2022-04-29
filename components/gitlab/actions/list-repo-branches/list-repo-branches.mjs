import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-list-repo-branches",
  name: "List Repo Branches",
  description: "Get a list of repository branches from a project. [See docs](https://docs.gitlab.com/ee/api/branches.html#list-repository-branches)",
  version: "0.2.0",
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    search: {
      propDefinition: [
        gitlab,
        "query",
      ],
      type: "string",
      description: "Return list of branches containing the search string. You can use ^term and term$ to find branches that begin and end with term respectively",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gitlab.listBranches(this.projectId, {
      search: this.search,
    });
    const { data: branches } = response;
    const suffix = branches.length === 1
      ? ""
      : "es";
    $.export("$summary", `Retrieved ${branches.length} branch${suffix}`);
    return branches;
  },
};
