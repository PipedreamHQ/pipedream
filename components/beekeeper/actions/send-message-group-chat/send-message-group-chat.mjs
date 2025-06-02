import beekeeper from "../../beekeeper.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "beekeeper-send-message-group-chat",
  name: "Send Message to Group Chat",
  description: "Send a precomposed message to a defined group chat. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/9075b32d36db4-send-a-message-to-a-group-chat)",
  version: "0.0.{{ts}}",
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
    refersTo: {
      type: "string",
      label: "Refers To",
      description: "Field used by message deletion event. Marks the ID of the message the deletion message refers to.",
      optional: true,
    },
    mentions: {
      type: "string[]",
      label: "Mentions",
      description: "IDs of the users mentioned in the message body. Can also have value of 'all', which means all the chat members were mentioned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      body: this.body,
      attachment: this.attachment,
      event: {
        type: this.eventType,
      },
      chat_state_addons: this.chatStateAddons?.map(JSON.parse),
      message_addons: this.messageAddons?.map(JSON.parse),
      refers_to: this.refersTo,
      mentions: this.mentions,
    };

    const response = await this.beekeeper.sendMessage({
      chatId: this.chatId,
      ...data,
    });

    $.export("$summary", `Message sent successfully to chat ID: ${this.chatId}`);
    return response;
  },
};
