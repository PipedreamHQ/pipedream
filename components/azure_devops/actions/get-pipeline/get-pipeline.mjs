import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-pipeline",
  name: "Get Pipeline",
  description: "Retrieve one pipeline, including the repository and path of the YAML file that defines it. Use this to confirm which definition file a pipeline runs before triggering it. Example: pipeline `12`. Run the **List Pipelines** action first to obtain the pipeline id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/pipelines/get?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    pipelineId: {
      propDefinition: [
        azureDevops,
        "pipelineId",
      ],
    },
    pipelineVersion: {
      type: "integer",
      label: "Pipeline Version",
      description: "Return this specific version of the pipeline. Defaults to the latest.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getPipeline({
      $,
      organization: this.organization,
      project: this.project,
      pipelineId: this.pipelineId,
      params: {
        pipelineVersion: this.pipelineVersion,
      },
    });
    $.export("$summary", `Retrieved pipeline ${response.id}: ${response.name}`);
    return response;
  },
};
