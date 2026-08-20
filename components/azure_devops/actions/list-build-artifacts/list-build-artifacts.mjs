// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-build-artifacts",
  name: "List Build Artifacts",
  description: "List the artifacts a build published, each with its download url and resource type. Use this to hand a build's output to a downstream deploy step. Example: build `4821` returns `drop`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/artifacts/list?view=azure-devops-rest-7.1)",
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
    const { value: artifacts } = await this.azureDevops.listBuildArtifacts({
      $,
      organization: this.organization,
      project: this.project,
      buildId: this.buildId,
    });
    $.export("$summary", `Found ${artifacts.length} artifact${artifacts.length === 1
      ? ""
      : "s"} for build ${this.buildId}`);
    return artifacts;
  },
};
