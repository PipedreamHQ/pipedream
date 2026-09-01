// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-processes",
  name: "List Processes",
  description: "List the process templates (Agile, Scrum, Basic, CMMI and any custom ones) available in an organization. Returns each template's id, name and description. Use this to obtain the process template id required by the **Create Project** action. Example: organization `contoso` returns Agile with id `adcc42ab-9882-485e-a3ed-7678f01f66bc`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/processes/list?view=azure-devops-rest-7.1)",
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
  },
  async run({ $ }) {
    const { value: processes } = await this.azureDevops.listProcesses({
      $,
      organization: this.organization,
    });
    $.export("$summary", `Found ${processes.length} process template${processes.length === 1
      ? ""
      : "s"}`);
    return processes;
  },
};
