import { axios } from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-new-message-instant",
  name: "New Message Created in Conversation",
  description:
    "Emit new event when a new message is created in a conversation. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kustomer: {
      type: "app",
      app: "kustomer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name associated with the message event.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL associated with the message event.",
    },
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
      const lastTs = 0;
      await this.db.set("last_ts", lastTs);
      const messages = await this.kustomer.listMessages({
        perpage: 50,
        sort: "desc",
      });
      for (const message of messages.reverse()) {
        const eventData = {
          message,
          name: this.name,
          url: this.url,
        };
        this.$emit(
          eventData,
          {
            id: message.id,
            summary: `New Kustomer message: ${message.content
              ? message.content.substring(0, 20) + "..."
              : "New message created."}`,
            ts: Date.parse(message.createdAt) || Date.now(),
            event: "kustomer.message.create",
          },
        );
      }
      if (messages.length > 0) {
        const latestMessage = messages[0];
        const latestTimestamp = Date.parse(latestMessage.createdAt);
        await this.db.set("last_ts", latestTimestamp);
      }
    },
    async activate() {
      // Code to create webhook subscription if needed
    },
    async deactivate() {
      // Code to delete webhook subscription if needed
    },
  },
  methods: {
    async listMessages(params = {}) {
      return await this.kustomer._makeRequest({
        method: "GET",
        path: "/messages",
        params,
      });
    },
    async getLastTimestamp() {
      return this.db.get("last_ts") || 0;
    },
    async setLastTimestamp(timestamp) {
      await this.db.set("last_ts", timestamp);
    },
  },
  async run() {
    const lastTimestamp = await this.getLastTimestamp();
    const newMessages = await this.listMessages({
      since: lastTimestamp,
      perpage: 100,
      sort: "asc",
    });

    for (const message of newMessages) {
      const eventData = {
        message,
        name: this.name,
        url: this.url,
      };
      this.$emit(
        eventData,
        {
          id: message.id,
          summary: `New Kustomer message: ${message.content
            ? message.content.substring(0, 20) + "..."
            : "New message created."}`,
          ts: Date.parse(message.createdAt) || Date.now(),
          event: "kustomer.message.create",
        },
      );
    }

    if (newMessages.length > 0) {
      const latestMessage = newMessages[newMessages.length - 1];
      const latestTimestamp = Date.parse(latestMessage.createdAt);
      await this.setLastTimestamp(latestTimestamp);
    }
  },
};
