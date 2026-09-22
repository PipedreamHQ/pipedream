import zoho_salesiq from "../../zoho_salesiq.app.mjs";

export default {
  key: "zoho_salesiq-list-screen-name-options",
  name: "List Screen Name Options",
  description: "Retrieves available options for the Screen Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_salesiq,
  },
  async run({ $ }) {
    const options = await zoho_salesiq.propDefinitions.screenName.options.call(this.zoho_salesiq);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
