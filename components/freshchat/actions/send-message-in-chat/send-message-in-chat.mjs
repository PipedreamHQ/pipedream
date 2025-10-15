import freshchat from "../../freshchat.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshchat-send-message-in-chat",
  name: "Send Message in Chat",
  description: "Sends a message in a specific conversation. [See the documentation](https://developers.freshchat.com/api/#send_message_to_conversation)",
  version: "0.0.3",
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
    actorType: {
      type: "string",
      label: "Actor Type",
      description: "Type of the entity who sent the message to the conversation",
      options: [
        "user",
        "agent",
      ],
    },
    agentId: {
      propDefinition: [
        freshchat,
        "agentId",
      ],
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the message to send",
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "Type of message to be sent to the conversation",
      options: [
        "normal",
        "private",
      ],
      default: "normal",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.actorType === "agent" && !this.agentId) {
      throw new ConfigurationError("Agent ID is required when actor type is agent");
    }

    const data = {
      message_parts: [
        {
          text: {
            content: this.message,
          },
        },
      ],
      actor_type: this.actorType,
      actor_id: this.actorType === "user"
        ? this.userId
        : this.agentId,
      user_id: this.actorType === "user"
        ? this.userId
        : undefined,
      message_type: this.messageType,
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
