import { axios } from "@pipedream/platform";
import elastic_email from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-new-email-open",
  name: "New Email Open",
  description: "Emit a new event when a recipient opens an email. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    elastic_email: {
      type: "app",
      app: "elastic_email",
    },
    db: "$.service.db",
  },
  methods: {
    async registerWebhook() {
      const webhookUrl = this.$endpoint.url;
      await this.elastic_email._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          Events: [
            "Open",
          ],
          Url: webhookUrl,
        },
      });
    },
    async unregisterWebhook() {
      const webhooks = await this.elastic_email._makeRequest({
        method: "GET",
        path: "/webhooks",
      });
      const webhook = webhooks.find((w) => w.Url === this.$endpoint.url);
      if (webhook) {
        await this.elastic_email._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhook.Id}`,
        });
      }
    },
  },
  hooks: {
    async deploy() {
      const response = await this.elastic_email._makeRequest({
        method: "GET",
        path: "/events",
        params: {
          EventType: "Open",
          limit: 50,
          sort: "desc",
        },
      });
      const events = response || [];
      events.slice(0, 50).forEach((event) => {
        this.$emit(
          event,
          {
            id: event.Id || event.Timestamp,
            summary: `Email opened by ${event.Email}`,
            ts: event.Timestamp
              ? Date.parse(event.Timestamp)
              : Date.now(),
          },
        );
      });
    },
    async activate() {
      await this.registerWebhook();
    },
    async deactivate() {
      await this.unregisterWebhook();
    },
  },
  async run(event) {
    if (event.Type === "Open") {
      this.$emit(
        event,
        {
          id: event.Id || event.Timestamp,
          summary: `Email opened by ${event.Email}`,
          ts: event.Timestamp
            ? Date.parse(event.Timestamp)
            : Date.now(),
        },
      );
    }
  },
};
