// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-pipeline-runs",
  name: "List Pipeline Runs",
  description: "List the most recent runs of a pipeline, each with its id, state, result and creation time. Use this to check whether a pipeline is currently running before triggering another. Example: pipeline `12`. Run the **List Pipelines** action first to obtain the pipeline id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/runs/list?view=azure-devops-rest-7.1)",
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
    pipelineId: {
      propDefinition: [
        azureDevops,
        "pipelineId",
      ],
    },
  },
  async run({ $ }) {
    const { value: runs } = await this.azureDevops.listPipelineRuns({
      $,
      organization: this.organization,
      project: this.project,
      pipelineId: this.pipelineId,
    });
    $.export("$summary", `Found ${runs.length} run${runs.length === 1
      ? ""
      : "s"} of pipeline ${this.pipelineId}`);
    return runs;
  },
};
