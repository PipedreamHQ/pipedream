// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "azure_devops-create-release",
  name: "Create Release",
  description: "Create a classic release from a release definition, optionally as a draft or with specific artifact versions. Returns the new release's id and name. Omit **Artifacts** to take the definition's latest versions. Use this to ship a build through a classic release pipeline. Example: definition `3`, description `Nightly deploy`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/release/releases/create?view=azure-devops-rest-7.1)",
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
        "releaseDefinitionId",
      ],
    },
    description: {
      propDefinition: [
        azureDevops,
        "description",
      ],
      description: "Description of the release",
    },
    isDraft: {
      propDefinition: [
        azureDevops,
        "isDraft",
      ],
      description: "Create the release in draft mode instead of starting it",
    },
    artifacts: {
      type: "string",
      label: "Artifacts",
      description: "JSON array of artifact versions to release. Example: `[{\"alias\":\"MyBuild\",\"instanceReference\":{\"id\":\"123\",\"name\":\"20260101.1\"}}]`. Omit to use the definition's latest artifact versions.",
      optional: true,
    },
    manualEnvironments: {
      type: "string[]",
      label: "Manual Environments",
      description: "Names of environments that should require a manual trigger rather than deploying automatically",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.createRelease({
      $,
      organization: this.organization,
      project: this.project,
      data: {
        definitionId: this.definitionId,
        description: this.description,
        isDraft: this.isDraft,
        artifacts: parseObject(this.artifacts, "Artifacts"),
        manualEnvironments: this.manualEnvironments,
      },
    });
    $.export("$summary", `Created release ${response.id}: ${response.name}`);
    return response;
  },
};
