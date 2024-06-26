import clickfunnels from "../../clickfunnels.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clickfunnels-new-one-time-order-paid-instant",
  name: "New One-Time Order Paid (Instant)",
  description: "Emit new event when a one-time order gets paid by a customer. [See the documentation](https://developers.myclickfunnels.com/reference/createwebhooksoutgoingendpoints)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clickfunnels: {
      type: "app",
      app: "clickfunnels",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch for this webhook
    },
    async activate() {
      const response = await axios(this, {
        method: "POST",
        url: `${this.clickfunnels._baseUrl()}/workspaces/${this.clickfunnels.$auth.workspace_id}/webhooks/outgoing/endpoints`,
        headers: {
          Authorization: `Bearer ${this.clickfunnels.$auth.oauth_access_token}`,
        },
        data: {
          url: this.http.endpoint,
          name: "New One-Time Order Paid Webhook",
          event_type_ids: [
            "one-time-order.invoice.paid",
          ],
          api_version: 2,
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.clickfunnels._baseUrl()}/workspaces/${this.clickfunnels.$auth.workspace_id}/webhooks/outgoing/endpoints/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.clickfunnels.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    await this.clickfunnels.handleOneTimeOrderPaid(event.body);
  },
};
