import alegra from "../../alegra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alegra-new-item",
  name: "New Item Added",
  description: "Emit new event each time a new item is added. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    alegra: {
      type: "app",
      app: "alegra",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.alegra.createWebhookSubscription({
        event: "new-item",
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhook.subscription.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.alegra._makeRequest({
          method: "DELETE",
          path: `/webhooks/subscriptions/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
    async deploy() {
      try {
        const items = await this.alegra.paginate(
          async (opts) => this.alegra._makeRequest(opts),
          {
            path: "/items",
            params: {
              limit: 50,
              sort: "-id",
            },
          },
        );
        const last50 = items.slice(-50);
        for (const item of last50) {
          this.$emit(item, {
            id: item.id,
            summary: `New item added: ${item.name}`,
            ts: Date.parse(item.createdAt) || Date.now(),
          });
        }
      } catch (error) {
        console.error("Error deploying alegra-new-item source:", error);
      }
    },
  },
  async run(event) {
    const item = event.body;
    const ts = Date.parse(item.createdAt) || Date.now();
    const id = item.id
      ? String(item.id)
      : String(ts);
    const summary = item.name
      ? `New item added: ${item.name}`
      : "New item added";
    this.$emit(item, {
      id,
      summary,
      ts,
    });
  },
};
