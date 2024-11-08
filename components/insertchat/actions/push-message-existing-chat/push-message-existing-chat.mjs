import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-push-message-existing-chat",
  name: "Push Message to Existing Chat",
  description: "Pushes a new message into an existing chat session in InsertChat",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    insertchat,
    chatSessionId: {
      propDefinition: [
        insertchat,
        "chatSessionId",
      ],
    },
    messageContent: {
      propDefinition: [
        insertchat,
        "messageContent",
      ],
    },
    messageSender: {
      propDefinition: [
        insertchat,
        "messageSender",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.insertchat.pushMessage(
      this.chatSessionId,
      this.messageContent,
      this.messageSender,
    );
    $.export("$summary", `Successfully pushed message to chat session ${this.chatSessionId}`);
    return response;
  },
};
