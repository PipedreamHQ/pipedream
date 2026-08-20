// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-build",
  name: "Get Build",
  description: "Retrieve one build by id. Returns its status, result, timings, requesting identity and source commit. Use this to poll a build queued earlier until it reaches `completed`. Example: build `4821`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/get?view=azure-devops-rest-7.1)",
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
    buildId: {
      propDefinition: [
        azureDevops,
        "buildId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getBuild({
      $,
      organization: this.organization,
      project: this.project,
      buildId: this.buildId,
    });
    $.export("$summary", `Retrieved build ${response.id} (${response.status}${response.result
      ? `/${response.result}`
      : ""})`);
    return response;
  },
};
