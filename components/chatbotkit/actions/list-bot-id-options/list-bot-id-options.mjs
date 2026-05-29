import chatbotkit from "../../chatbotkit.app.mjs";

export default {
  key: "chatbotkit-list-bot-id-options",
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
    chatbotkit,
  },
  async run({ $ }) {
    const options = await chatbotkit.propDefinitions.botId.options.call(this.chatbotkit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
