import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-work-item-types",
  name: "List Work Item Types",
  description: "List the work item types available in a project, each with the states and fields it allows. Use this to discover valid values for the **Work Item Type** and **State** inputs before creating or updating an item - the states differ per process, so a Basic project uses `To Do`/`Doing`/`Done` where Agile uses `New`/`Active`/`Closed`. Example: project `Fabrikam-Fiber-Git` returns Bug, Task, Epic and User Story. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-item-types/list?view=azure-devops-rest-7.1)",
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
  },
  async run({ $ }) {
    const { value: types } = await this.azureDevops.listWorkItemTypes({
      $,
      organization: this.organization,
      project: this.project,
    });
    $.export("$summary", `Found ${types.length} work item type${types.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return types;
  },
};
