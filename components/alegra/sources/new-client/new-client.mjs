import alegra from "../../alegra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alegra-new-client",
  name: "New Client Created",
  description: "Emit new event when a brand new client is created. [See the documentation](https://developer.alegra.com/reference/post_webhooks-subscriptions)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    alegra: {
      type: "app",
      app: "alegra",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const subscription = await this.alegra.createWebhookSubscription({
        event: "new-client",
        url: this.http.endpoint,
      });
      await this.db.set("webhook_subscription_id", subscription.id);
    },
    async deactivate() {
      const subscriptionId = await this.db.get("webhook_subscription_id");
      if (subscriptionId) {
        await this.alegra.deleteWebhook(subscriptionId);
        await this.db.set("webhook_subscription_id", null);
      }
    },
    async deploy() {
      const response = await this.alegra._makeRequest({
        path: "/contacts",
        params: {
          limit: 50,
          sort: "createdAt",
          order: "desc",
        },
      });
      const contacts = response.items;
      contacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New client created: ${contact.name}`,
          ts: new Date(contact.createdAt).getTime(),
        });
      }
    },
  },
  async run(event) {
    const client = event.body;
    const id = client.id || `${Date.now()}`;
    const summary = `New client created: ${client.name || "Unnamed client"}`;
    const ts = client.createdAt
      ? new Date(client.createdAt).getTime()
      : Date.now();
    this.$emit(client, {
      id,
      summary,
      ts,
    });
  },
};
