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

    let page = 1;
    const perPage = 100;
    let workflows = [];

    while (workflows.length < this.maxResults) {
      const { workflows: batch } = await this.github.listWorkflows({
        repoFullname,
        perPage,
        page,
      });

      if (!batch?.length) {
        break;
      }

      workflows = workflows.concat(batch);

      if (batch.length < perPage) {
        break;
      }
      page += 1;
    }

    workflows = workflows.slice(0, this.maxResults);

    $.export("$summary", `Retrieved ${workflows.length} workflow(s)`);

    return workflows;
  },
};
