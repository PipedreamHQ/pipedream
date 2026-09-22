import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-list-chatbot-id-options",
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
    aidbase,
  },
  async run({ $ }) {
    const options = await aidbase.propDefinitions.chatbotId.options.call(this.aidbase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
