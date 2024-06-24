import { axios } from "@pipedream/platform";
import kommo from "../../kommo.app.mjs";

export default {
  key: "kommo-new-lead-instant",
  name: "New Lead Instant",
  description: "Emit new event when a lead is created. [See the documentation](https://www.kommo.com/developers/content/api_v4/webhooks-2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kommo,
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
      const destination = this.$auth.webhook_url;
      const events = [
        "add_lead",
      ];
      await this.kommo.addWebhook(destination, events);
    },
    async activate() {
      const destination = this.$auth.webhook_url;
      const events = [
        "add_lead",
      ];
      await this.kommo.addWebhook(destination, events);
    },
    async deactivate() {
      const destination = this.$auth.webhook_url;
      await axios(this, {
        method: "DELETE",
        url: `${this.kommo._baseUrl()}/webhooks`,
        data: {
          destination,
        },
      });
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New Lead: ${event.body.name}`,
      ts: Date.parse(event.body.created_at),
    });
  },
};
