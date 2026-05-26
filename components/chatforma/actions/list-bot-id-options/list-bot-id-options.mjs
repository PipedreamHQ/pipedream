import chatforma from "../../chatforma.app.mjs";

export default {
  key: "chatforma-list-bot-id-options",
  name: "List Bot ID Options",
  description: "Retrieves available options for the Bot ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chatforma,
  },
  async run({ $ }) {
    const options = await chatforma.propDefinitions.botId.options.call(this.chatforma);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
