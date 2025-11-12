import { ConfigurationError } from "@pipedream/platform";
import beekeeper from "../../beekeeper.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "beekeeper-send-message-group-chat",
  name: "Send Message to Group Chat",
  description: "Send a precomposed message to a defined group chat. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/9075b32d36db4-send-a-message-to-a-group-chat)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    beekeeper,
    chatId: {
      propDefinition: [
        beekeeper,
        "chatId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The message body. Supports rich text formatting.",
      optional: true,
    },
    attachment: {
      type: "object",
      label: "Attachment",
      description: "JSON object representing attachment. A valid attachment object can be created and fetched using the POST /files/{usage_type}/upload endpoint.",
      optional: true,
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Type of event that the message corresponds to.",
      optional: true,
    },
    chatStateAddons: {
      type: "string[]",
      label: "Chat State Addons",
      description: "Array of objects containing type and data fields for chat state addons.",
      optional: true,
    },
    messageAddons: {
      type: "string[]",
      label: "Message Addons",
      description: "Array of objects containing type and data fields for message addons.",
      optional: true,
    },
    mentions: {
      propDefinition: [
        beekeeper,
        "mentions",
        ({ chatId }) => ({
          chatId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.body && !this.eventType && !this.attachment && !this.chatStateAddons) {
      throw new ConfigurationError("You must provide at least **Body**, **Event**, **Attachment** or **Chat State Addons**");
    }
    const response = await this.beekeeper.sendMessage({
      $,
      chatId: this.chatId,
      data: {
        body: this.body,
        attachment: parseObject(this.attachment),
        ...(this.eventType
          ? {
            event: {
              type: this.eventType,
            },
          }
          : {}),
        chat_state_addons: parseObject(this.chatStateAddons),
        message_addons: parseObject(this.messageAddons),
        mentions: parseObject(this.mentions),
      },
    });

    $.export("$summary", `Message sent successfully to chat ID: ${this.chatId}`);
    return response;
  },
};
