import hana from "../../hana.app.mjs";

export default {
  key: "hana-get-chat-completion-status",
  name: "Get Chat Completion Status",
  description: "Get the status of a chat completion. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#chat-completion-status)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hana,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Provide the messageId obtained from the Chat Completion response. The expected format is `client-hana-123457899`.",
    },
  },
  async run({ $ }) {
    const response = await this.hana.getChatCompletionStatus({
      $,
      messageId: this.messageId,
    });
    $.export("$summary", "Successfully retrieved chat completion status.");
    return response;
  },
};
