import loopmessage from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-list-sender-options",
  name: "List Sender Options",
  description: "Retrieves available options for the Sender field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    loopmessage,
  },
  async run({ $ }) {
    const options = await loopmessage.propDefinitions.sender.options.call(this.loopmessage);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
