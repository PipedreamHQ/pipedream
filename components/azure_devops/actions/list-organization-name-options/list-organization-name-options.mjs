// x-pd-ai: optimized
import azure_devops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-organization-name-options",
  name: "List Organizations",
  description: "List the Azure DevOps organizations the connected account belongs to. Use this first - every other action needs an organization name, and this is the only action that does not. Returns the organization names as plain strings. Example: returns `contoso` and `fabrikam`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/account/accounts/list?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azure_devops,
  },
  async run({ $ }) {
    const options = await azure_devops.propDefinitions.organizationName.options
      .call(this.azure_devops);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
