// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-release",
  name: "Get Release",
  description: "Retrieve one classic release. Returns its environments, each environment's deployment status, and the artifacts it carries. Use this to check whether a release reached production. Example: release `27`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/release/releases/get-release?view=azure-devops-rest-7.1)",
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
    releaseId: {
      propDefinition: [
        azureDevops,
        "releaseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getRelease({
      $,
      organization: this.organization,
      project: this.project,
      releaseId: this.releaseId,
    });
    $.export("$summary", `Retrieved release ${response.id}: ${response.name}`);
    return response;
  },
};
