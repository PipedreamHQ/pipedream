import azure_devops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-organization-name-options",
  name: "List Organization Options",
  description: "Retrieves available options for the Organization field.",
  version: "0.0.1",
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
