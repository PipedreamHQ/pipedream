// legacy_hash_id: a_k6iKgR
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-send-chat-message",
  name: "Send Chat Message",
  description: "Send chat messages on Zoom to either an individual user who is in your contact list or to a  of which you are a member.",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    message: {
      type: "string",
      description: "The message to be sent.",
    },
    to_contact: {
      type: "string",
      description: "The email address of the contact to whom you would like to send the message.",
      optional: true,
    },
    to_channel: {
      type: "string",
      description: "The Channel Id of the channel where you would like to send a message.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/chat-messages/sendachatmessage
    const config = {
      method: "post",
      url: "https://api.zoom.us/v2/chat/users/me/messages",
      data: {
        message: this.message,
        to_contact: this.to_contact,
        to_channel: this.to_channel,
      },
      headers: {
        Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
      },
    };
    return await axios($, config);
  },
};
