import azureDevops from "../../azure_devops.app.mjs";
import { BUILD_CANCELLING_STATUS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-cancel-build",
  name: "Cancel Build",
  description: "Cancel a build that is still running. Returns the build with its status moved to cancelling. Use this to stop a run that has been superseded or was triggered in error. Example: build `4821`. Run the **List Builds** action first to obtain the build id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/update-build?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    buildId: {
      propDefinition: [
        azureDevops,
        "buildId",
      ],
      description: "Numeric ID of the in-progress build to cancel. Run the **List Builds** action first to obtain valid values.",
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.updateBuild({
      $,
      organization: this.organization,
      project: this.project,
      buildId: this.buildId,
      data: {
        status: BUILD_CANCELLING_STATUS,
      },
    });
    $.export("$summary", `Requested cancellation of build ${this.buildId}`);
    return response;
  },
};
