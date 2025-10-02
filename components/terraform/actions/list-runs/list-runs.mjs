import terraform from "../../terraform.app.mjs";

export default {
  key: "terraform-list-runs",
  name: "List Runs",
  description: "Retrieves a list of runs in a workspace in Terraform. [See the documentation](https://developer.hashicorp.com/terraform/cloud-docs/api-docs/run#list-runs-in-a-workspace)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    terraform,
    orgId: {
      propDefinition: [
        terraform,
        "orgId",
      ],
    },
    workspaceId: {
      propDefinition: [
        terraform,
        "workspaceId",
        (c) => ({
          orgId: c.orgId,
        }),
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return. Default to 100.",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const items = this.terraform.paginate({
      resourceFn: this.terraform.listRuns,
      args: {
        workspaceId: this.workspaceId,
        $,
      },
    });

    let count = 0;
    const runs = [];
    for await (const run of items) {
      runs.push(run);
      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    if (runs?.length) {
      $.export("$summary", `Successfully retrieved ${runs.length} run${runs.length === 1
        ? ""
        : "s"}.`);
    }

    return runs;
  },
};
