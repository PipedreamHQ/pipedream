// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import { EMPTY_OBJECT_ID } from "../../common/constants.mjs";

export default {
  key: "azure_devops-create-branch",
  name: "Create Branch",
  description: "Create a branch pointing at an existing commit. Returns the ref update result. Use this to open a working branch before pushing changes and raising a pull request. Example: new branch `feature/login` at commit `a3fecf65a6766ebc6f2e33b66a1520b827c67ef8`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/refs/update-refs?view=azure-devops-rest-7.1)",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    branchName: {
      type: "string",
      label: "New Branch Name",
      description: "Name of the branch to create, without the `refs/heads/` prefix, e.g. `feature/login`",
    },
    commitId: {
      propDefinition: [
        azureDevops,
        "commitId",
      ],
      description: "Full 40-character SHA the new branch should point at. Run the **List Commits** action first to obtain valid values.",
    },
  },
  async run({ $ }) {
    const name = this.branchName.startsWith("refs/")
      ? this.branchName
      : `refs/heads/${this.branchName}`;
    const { value: results } = await this.azureDevops.updateRefs({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      data: [
        {
          name,
          oldObjectId: EMPTY_OBJECT_ID,
          newObjectId: this.commitId,
        },
      ],
    });
    const [
      result,
    ] = results;
    if (result?.success === false) {
      throw new ConfigurationError(`Azure DevOps rejected the branch creation: ${result.customMessage ?? result.updateStatus}`);
    }
    $.export("$summary", `Created branch ${name} at ${this.commitId}`);
    return result;
  },
};
