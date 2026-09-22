import zoho_creator from "../../zoho_creator.app.mjs";

export default {
  key: "zoho_creator-list-app-link-name-options",
  name: "List Application Options",
  description: "Retrieves available options for the Application field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_creator,
  },
  async run({ $ }) {
    const options = await zoho_creator.propDefinitions.appLinkName.options.call(this.zoho_creator);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
