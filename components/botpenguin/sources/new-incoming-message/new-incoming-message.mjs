import { axios } from "@pipedream/platform";
import botpenguin from "../../botpenguin.app.mjs";

export default {
  key: "botpenguin-new-incoming-message",
  name: "New Incoming Message",
  description: "Emits an event for each new incoming message from a user. [See the documentation](https://www.notion.so/reltech/integrations-with-3rd-party-workflow-builder-apps-e-g-zapier-bad7cb1e0edf448a8171ebdab5a19932)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    botpenguin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 messages to avoid emitting old messages on the first run
      const messages = await this.botpenguin._makeRequest({
        path: "/inbox/messages",
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.botpenguin.$auth.oauth_access_token}`,
        },
      });
      messages.slice(0, 50).forEach((message) => {
        this.$emit(message, {
          id: message.id,
          summary: `New message from ${message.sender.name}: ${message.content}`,
          ts: Date.parse(message.created_at),
        });
      });
    },
  },
  methods: {
    async fetchMessages() {
      return this.botpenguin._makeRequest({
        path: "/inbox/messages",
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.botpenguin.$auth.oauth_access_token}`,
        },
      });
    },
  },
  async run() {
    const lastMessageId = this.db.get("lastMessageId") || 0;
    const messages = await this.fetchMessages();
    const newMessages = messages.filter((message) => message.id > lastMessageId);

    newMessages.forEach((message) => {
      this.$emit(message, {
        id: message.id,
        summary: `New message from ${message.sender.name}: ${message.content}`,
        ts: Date.parse(message.created_at),
      });
    });

    if (newMessages.length > 0) {
      this.db.set("lastMessageId", newMessages[0].id);
    }
  },
};
