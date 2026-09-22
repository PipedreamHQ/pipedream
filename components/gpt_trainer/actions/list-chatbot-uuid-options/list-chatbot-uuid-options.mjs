import gpt_trainer from "../../gpt_trainer.app.mjs";

export default {
  key: "gpt_trainer-list-chatbot-uuid-options",
  name: "List Chatbot UUID Options",
  description: "Retrieves available options for the Chatbot UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gpt_trainer,
  },
  async run({ $ }) {
    const options = await gpt_trainer.propDefinitions.chatbotUuid.options.call(this.gpt_trainer);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
