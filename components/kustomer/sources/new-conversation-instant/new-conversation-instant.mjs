import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-new-conversation-instant",
  name: "New Conversation Created",
  description: "Emit new event when a conversation is created in Kustomer. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kustomer: {
      type: "app",
      app: "kustomer",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const lastRun = (await this.db.get("lastRun")) || new Date(0).toISOString();
      const conversations = await this.kustomer.listConversations(lastRun);

      const sortedConversations = conversations.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      const limitedConversations = sortedConversations.slice(-50);

      for (const conv of limitedConversations) {
        const eventData = await this.kustomer.emitConversationCreateEvent(conv.name, conv.url);
        this.$emit(eventData, {
          id: conv.id || conv.createdAt,
          summary: `New Conversation: ${conv.name}`,
          ts: Date.parse(conv.createdAt) || Date.now(),
        });
      }

      if (limitedConversations.length > 0) {
        const latestCreatedAt = Math.max(...limitedConversations.map((conv) => Date.parse(conv.createdAt)));
        await this.db.set("lastRun", new Date(latestCreatedAt).toISOString());
      }
    },
    async activate() {
      // Implement webhook subscription if supported by Kustomer
      // Example:
      // await this.kustomer.subscribeToConversations();
    },
    async deactivate() {
      // Implement webhook unsubscription if supported by Kustomer
      // Example:
      // await this.kustomer.unsubscribeFromConversations();
    },
  },
  async run() {
    const lastRun = (await this.db.get("lastRun")) || new Date(0).toISOString();
    const conversations = await this.kustomer.listConversations(lastRun);

    const sortedConversations = conversations.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    for (const conv of sortedConversations) {
      const eventData = await this.kustomer.emitConversationCreateEvent(conv.name, conv.url);
      this.$emit(eventData, {
        id: conv.id || conv.createdAt,
        summary: `New Conversation: ${conv.name}`,
        ts: Date.parse(conv.createdAt) || Date.now(),
      });
    }

    if (conversations.length > 0) {
      const latestCreatedAt = Math.max(...conversations.map((conv) => Date.parse(conv.createdAt)));
      await this.db.set("lastRun", new Date(latestCreatedAt).toISOString());
    }
  },
};
