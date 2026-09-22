import zoho_bugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-list-portal-id-options",
  name: "List Portal ID Options",
  description: "Retrieves available options for the Portal ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_bugtracker,
  },
  async run({ $ }) {
    const options = await zoho_bugtracker.propDefinitions.portalId.options
      .call(this.zoho_bugtracker);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
