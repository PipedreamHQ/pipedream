import zoho_cliq from "../../zoho_cliq.app.mjs";

export default {
  key: "zoho_cliq-list-chat-options",
  name: "List Chat ID Options",
  description: "Retrieves available options for the Chat ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_cliq,
  },
  async run({ $ }) {
    const options = await zoho_cliq.propDefinitions.chat.options.call(this.zoho_cliq);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
