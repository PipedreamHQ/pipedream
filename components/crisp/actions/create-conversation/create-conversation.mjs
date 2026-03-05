import crisp from "../../crisp.app.mjs";

export default {
  key: "crisp-create-conversation",
  name: "Create Conversation",
  description: "Create a new conversation and sends a message. [See the documentation](https://docs.crisp.chat/references/rest-api/v1/#create-a-new-conversation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    crisp,
    from: {
      type: "string",
      label: "From",
      description: "The type of the sender",
      options: [
        "user",
        "operator",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message",
    },
  },
  async run({ $ }) {
    const { data: { session_id: sessionId } } = await this.crisp.createConversation({
      $,
    });

    const response = await this.crisp.sendMessage({
      $,
      sessionId,
      data: {
        type: "text",
        from: this.from,
        origin: "chat",
        content: this.content,
      },
    });

    $.export("$summary", `Successfully created conversation with ID: ${sessionId}.`);
    return response;
  },
};
