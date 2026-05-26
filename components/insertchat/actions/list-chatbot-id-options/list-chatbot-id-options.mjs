import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-list-chatbot-id-options",
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
    insertchat,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await insertchat.propDefinitions.chatbotId.options.call(this.insertchat, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
