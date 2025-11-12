// legacy_hash_id: a_1WiE5L
import { axios } from "@pipedream/platform";

export default {
  key: "chat_api_for_whatsapp-send-message",
  name: "Send Message",
  description: "Send a message to a new or existing chat.",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chat_api_for_whatsapp: {
      type: "app",
      app: "chat_api_for_whatsapp",
    },
    phone: {
      type: "string",
    },
    body: {
      type: "string",
    },
  },
  async run({ $ }) {
  // See https://app.chat-api.com/docs#sendMessage

    return await axios($, {
      method: "post",
      url: `${this.chat_api_for_whatsapp.$auth.api_url}/sendMessage?token=${this.chat_api_for_whatsapp.$auth.token}`,
      data: {
        phone: this.phone,
        body: this.body,
      },
    });
  },
};
