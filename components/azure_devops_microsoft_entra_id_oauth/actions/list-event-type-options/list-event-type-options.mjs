import azure_devops_microsoft_entra_id_oauth
  from "../../azure_devops_microsoft_entra_id_oauth.app.mjs";

export default {
  key: "azure_devops_microsoft_entra_id_oauth-list-event-type-options",
  name: "List Event Type Options",
  description: "Retrieves available options for the Event Type field.",
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
    const options = await azure_devops_microsoft_entra_id_oauth.propDefinitions.eventType.options
      .call(this.azure_devops_microsoft_entra_id_oauth);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
