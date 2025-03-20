import { axios } from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-updated-conversation-instant",
  name: "Updated Conversation Instant",
  description: "Emit new event when an existing conversation is updated in Kustomer. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kustomer,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the resource",
    },
    url: {
      type: "string",
      label: "URL",
      description: "Webhook URL or similar",
    },
  },
  hooks: {
    async deploy() {
      const lastTimestamp = await this.db.get("lastTimestamp") || 0;
      const conversations = await this.kustomer.paginate(this.kustomer.listConversations, {
        query: {
          updated_at_gt: lastTimestamp,
        },
        perpage: 50,
      });

      // Sort conversations by updatedAt in descending order
      conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const latestConvos = conversations.slice(0, 50);
      let latestTimestamp = lastTimestamp;

      for (const convo of latestConvos) {
        const updatedAt = Date.parse(convo.updatedAt) || Date.now();
        const eventData = await this.kustomer.emitConversationUpdateEvent(this.name, this.url);

        this.$emit(
          {
            name: convo.name,
            url: convo.url,
            ...eventData,
          },
          {
            id: convo.id || updatedAt,
            summary: `Conversation Updated: ${convo.name}`,
            ts: updatedAt,
          },
        );

        if (updatedAt > latestTimestamp) {
          latestTimestamp = updatedAt;
        }
      }

      await this.db.set("lastTimestamp", latestTimestamp);
    },
    async activate() {
      // No activation steps required for polling source
    },
    async deactivate() {
      // No deactivation steps required for polling source
    },
  },
  async run() {
    const lastTimestamp = await this.db.get("lastTimestamp") || 0;
    const conversations = await this.kustomer.paginate(this.kustomer.listConversations, {
      query: {
        updated_at_gt: lastTimestamp,
      },
      perpage: 50,
    });

    let latestTimestamp = lastTimestamp;

    for (const convo of conversations) {
      const updatedAt = Date.parse(convo.updatedAt) || Date.now();
      const eventData = await this.kustomer.emitConversationUpdateEvent(this.name, this.url);

      this.$emit(
        {
          name: convo.name,
          url: convo.url,
          ...eventData,
        },
        {
          id: convo.id || updatedAt,
          summary: `Conversation Updated: ${convo.name}`,
          ts: updatedAt,
        },
      );

      if (updatedAt > latestTimestamp) {
        latestTimestamp = updatedAt;
      }
    }

    await this.db.set("lastTimestamp", latestTimestamp);
  },
};
