import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-build-logs",
  name: "List Build Logs",
  description: "List a build's log files, each with its id, line count and the url to fetch its content. Use this to locate the log for a failing step before fetching it. Example: build `4821` returns 3 logs. Run the **List Builds** action first to obtain the build id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/get-build-logs?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    const { value: logs } = await this.azureDevops.listBuildLogs({
      $,
      organization: this.organization,
      project: this.project,
      buildId: this.buildId,
    });
    $.export("$summary", `Found ${logs.length} log file${logs.length === 1
      ? ""
      : "s"} for build ${this.buildId}`);
    return logs;
  },
};
