import chatfly from "../../chatfly.app.mjs";

export default {
  key: "chatfly-list-bot-id-options",
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
    chatfly,
  },
  async run({ $ }) {
    const options = await chatfly.propDefinitions.botId.options.call(this.chatfly);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
