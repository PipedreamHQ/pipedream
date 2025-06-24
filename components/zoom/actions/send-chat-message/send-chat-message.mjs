import zoom from "../../zoom.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "zoom-send-chat-message",
  name: "Send Chat Message",
  description: "Send chat messages on Zoom to either an individual user who is in your contact list or to a channel of which you are a member. [See the documentation](https://developers.zoom.us/docs/api/team-chat/#tag/chat-messages/POST/chat/users/{userId}/messages)",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent",
    },
    toContact: {
      propDefinition: [
        zoom,
        "email",
      ],
      description: "The email address of the contact to whom you would like to send the message.",
      optional: true,
    },
    toChannel: {
      propDefinition: [
        zoom,
        "channelId",
      ],
    },
  },
  methods: {
    sendChatMessage(args = {}) {
      return this.zoom.create({
        path: "/chat/users/me/messages",
        ...args,
      });
    },
  },
  async run({ $ }) {
    if (!this.toContact && !this.toChannel) {
      throw new ConfigurationError("Must specify either \"To Contact\" or \"To Channel\"");
    }

    const response = await this.sendChatMessage({
      $,
      data: {
        message: this.message,
        to_contact: this.toContact,
        to_channel: this.toChannel,
      },
    });

    $.export("$summary", `Successfully sent message to ${this.toContact || this.toChannel}`);

    return response;
  },
};
