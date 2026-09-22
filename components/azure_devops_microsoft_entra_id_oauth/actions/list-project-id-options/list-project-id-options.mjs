import azure_devops_microsoft_entra_id_oauth
  from "../../azure_devops_microsoft_entra_id_oauth.app.mjs";

export default {
  key: "azure_devops_microsoft_entra_id_oauth-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azure_devops_microsoft_entra_id_oauth,
  },
  async run({ $ }) {
    const options = await azure_devops_microsoft_entra_id_oauth.propDefinitions.projectId.options
      .call(this.azure_devops_microsoft_entra_id_oauth);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
