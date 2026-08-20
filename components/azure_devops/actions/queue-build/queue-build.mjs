// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "azure_devops-queue-build",
  name: "Queue Build",
  description: "Queue a new build for a build definition, optionally on a specific branch and with variable overrides. Returns the queued build's id and status - the build itself runs asynchronously. Use this to trigger CI from an external event. Example: definition `12` on `refs/heads/main` with parameters `{ \\\"environment\\\": \\\"staging\\\" }`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/queue?view=azure-devops-rest-7.1)",
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
    definitionId: {
      propDefinition: [
        azureDevops,
        "buildDefinitionId",
      ],
    },
    sourceBranch: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      label: "Source Branch",
      description: "Fully qualified branch to build, e.g. `refs/heads/main`. Defaults to the definition's default branch.",
      optional: true,
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Build variables to override, keyed by variable name. Example: `{ \"environment\": \"staging\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const parameters = parseObject(this.parameters, "Parameters");
    const response = await this.azureDevops.queueBuild({
      $,
      organization: this.organization,
      project: this.project,
      data: {
        definition: {
          id: this.definitionId,
        },
        sourceBranch: this.sourceBranch,
        parameters: parameters
          ? JSON.stringify(parameters)
          : undefined,
      },
    });
    $.export("$summary", `Queued build ${response.id} for definition ${this.definitionId}`);
    return response;
  },
};
