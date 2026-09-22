import bot9 from "../../bot9.app.mjs";

export default {
  key: "bot9-list-chatbot-id-options",
  name: "List Chatbot ID Options",
  description: "Retrieves available options for the Chatbot ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bot9,
  },
  async run({ $ }) {
    const options = await bot9.propDefinitions.chatbotId.options.call(this.bot9);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
