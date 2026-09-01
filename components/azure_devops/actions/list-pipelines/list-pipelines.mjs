// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-pipelines",
  name: "List Pipelines",
  description: "List a project's YAML pipelines. Returns each pipeline's id, name, folder and revision. Use this to obtain the pipeline id the **Run Pipeline** action needs. Example: project `Fabrikam-Fiber-Git` returns `fabrikam-api-CI` with id `12`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/pipelines/list?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Sort expression, e.g. `name asc` or `name desc`. Defaults to `name asc`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of pipelines to return (1-1000)",
    },
  },
  async run({ $ }) {
    const pipelines = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({
        continuationToken, top,
      }) => this.azureDevops.listPipelines({
        $,
        organization: this.organization,
        project: this.project,
        params: {
          orderBy: this.orderBy,
          $top: top,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${pipelines.length} pipeline${pipelines.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return pipelines;
  },
};
