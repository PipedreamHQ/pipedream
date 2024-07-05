import twoChat from "../../2chat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "2chat-new-conversation-instant",
  name: "New Conversation Instant",
  description: "Emit new event when a new WhatsApp conversation is started on the user’s 2chat connected number.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    twoChat: {
      type: "app",
      app: "2chat",
    },
    connectedNumber: {
      propDefinition: [
        twoChat,
        "connectedNumber",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const response = await this.twoChat.checkWhatsAppAccount(this.connectedNumber);
      if (response.status !== 200) {
        throw new Error("The provided number is not a valid 2Chat connected number");
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["X-2Chat-Token"] !== this.twoChat.$auth.api_token) {
      return this.http.respond({
        status: 401,
      });
    }

    if (body.type === "conversation" && body.status === "created") {
      this.$emit(body, {
        id: body.id,
        summary: `New conversation started with ${body.contact.name}`,
        ts: Date.parse(body.createdAt),
      });
    }
  },
};
