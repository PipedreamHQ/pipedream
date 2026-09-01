// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "azure_devops-run-pipeline",
  name: "Run Pipeline",
  description: "Trigger a run of a YAML pipeline, optionally on a specific branch and with template parameters or variable overrides. Returns the run's id and state; the run itself proceeds asynchronously. Set **Preview Run** to validate instead: Azure DevOps then starts nothing and returns the final expanded YAML document rather than a run. Use this to deploy or test on demand. Example: pipeline `12` on `refs/heads/main`. Run the **List Pipelines** action first to obtain the pipeline id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/runs/run-pipeline?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    branch: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      label: "Branch",
      description: "Fully qualified branch to run the pipeline from, e.g. `refs/heads/main`. Defaults to the pipeline's default branch.",
      optional: true,
    },
    templateParameters: {
      type: "object",
      label: "Template Parameters",
      description: "Runtime parameters declared by the pipeline YAML, keyed by parameter name. Example: `{ \"environment\": \"staging\" }`",
      optional: true,
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "Pipeline variables to override, keyed by variable name. Example: `{ \"buildConfig\": \"Release\" }`",
      optional: true,
    },
    stagesToSkip: {
      type: "string[]",
      label: "Stages To Skip",
      description: "Names of pipeline stages to skip in this run",
      optional: true,
    },
    previewRun: {
      type: "boolean",
      label: "Preview Run",
      description: "Do not start a run - return the final expanded YAML document instead",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = parseObject(this.variables, "Variables");
    const response = await this.azureDevops.runPipeline({
      $,
      organization: this.organization,
      project: this.project,
      pipelineId: this.pipelineId,
      data: {
        previewRun: this.previewRun,
        stagesToSkip: this.stagesToSkip,
        templateParameters: parseObject(this.templateParameters, "Template Parameters"),
        variables: variables && Object.fromEntries(
          Object.entries(variables).map(([
            key,
            value,
          ]) => [
            key,
            {
              value: `${value}`,
            },
          ]),
        ),
        resources: this.branch
          ? {
            repositories: {
              self: {
                refName: this.branch,
              },
            },
          }
          : undefined,
      },
    });
    $.export("$summary", this.previewRun
      ? `Previewed pipeline ${this.pipelineId}`
      : `Started run ${response.id} of pipeline ${this.pipelineId}`);
    return response;
  },
};
