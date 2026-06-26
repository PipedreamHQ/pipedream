import github from "../../github.app.mjs";

export default {
  key: "github-list-workflows",
  name: "List Workflows",
  description: "List the GitHub Actions workflows defined in a repository. Returns each workflow's `id`, `name`, `path` (e.g. `.github/workflows/ci.yml`), and `state`. Use this to discover the workflow file name or ID needed by **Run Workflow**. Provide the repository as an `owner/repo` string. [See the documentation](https://docs.github.com/en/rest/actions/workflows#list-repository-workflows)",
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
        "repoFullnameStatic",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of workflows to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const { workflows } = await this.github.listWorkflows({
      repoFullname,
      perPage: this.maxResults,
      page: 1,
    });

    $.export("$summary", `Retrieved ${workflows.length} workflow(s)`);

    return workflows;
  },
};
