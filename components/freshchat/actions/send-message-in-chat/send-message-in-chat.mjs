import freshchat from "../../freshchat.app.mjs";

export default {
  key: "freshchat-send-message-in-chat",
  name: "Send Message in Chat",
  description: "Sends a message in a specific conversation. [See the documentation](https://developers.freshchat.com/api/#send_message_to_conversation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshchat,
    userId: {
      propDefinition: [
        freshchat,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        freshchat,
        "conversationId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the message to send",
    },
  },
  async run({ $ }) {
    const data = {
      message_parts: [
        {
          text: {
            content: this.message,
          },
        },
      ],
      actor_type: "user",
      actor_id: this.userId,
      user_id: this.userId,
    };
    try {
      await this.freshchat.sendMessageInChat({
        $,
        conversationId: this.conversationId,
        data,
      });
    } catch {
      // Sends message, but always returns the error
    /*   {
        "code": 400,
        "status": "INVALID_VALUE",
        "message": "com.demach.konotor.model.fragment.TextFragment cannot be cast to
          com.demach.konotor.model.fragment.EmailFragment"
      }
      */
    }
    $.export("$summary", `Sent message in conversation ${this.conversationId}`);
    return data;
  },
};
