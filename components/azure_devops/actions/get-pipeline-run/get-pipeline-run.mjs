// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-pipeline-run",
  name: "Get Pipeline Run",
  description: "Retrieve one pipeline run. Returns its state, result, the resources it consumed and the template parameters it ran with. Use this to poll a run started earlier until its state reaches `completed`. Example: pipeline `12`, run `48`. Run the **List Pipelines** action first to obtain the pipeline id, then the **List Pipeline Runs** action for valid run ids. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/runs/get?view=azure-devops-rest-7.1)",
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
    runId: {
      type: "integer",
      label: "Run ID",
      description: "Numeric ID of the run. Run the **List Pipeline Runs** action first to obtain valid values.",
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getPipelineRun({
      $,
      organization: this.organization,
      project: this.project,
      pipelineId: this.pipelineId,
      runId: this.runId,
    });
    $.export("$summary", `Retrieved run ${response.id} of pipeline ${this.pipelineId} (${response.state}${response.result
      ? `/${response.result}`
      : ""})`);
    return response;
  },
};
