import clickfunnels from "../../clickfunnels.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "clickfunnels-new-subscription-invoice-paid-instant",
  name: "New Subscription Invoice Paid",
  description: "Emit new event when a subscription fee is paid by a customer. [See the documentation](https://developers.myclickfunnels.com/reference/createwebhooksoutgoingendpoints)",
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
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emit historical events if needed
    },
    async activate() {
      const url = this.http.endpoint;
      const { workspace_id } = this.clickfunnels.$auth;
      const event_type_ids = [
        "subscription/invoice.paid",
      ];
      const name = "Pipedream Webhook";

      const response = await axios(this, {
        method: "POST",
        url: `${this.clickfunnels._baseUrl()}/workspaces/${workspace_id}/webhooks/outgoing/endpoints`,
        headers: {
          "Authorization": `Bearer ${this.clickfunnels.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: {
          url,
          name,
          event_type_ids,
          api_version: 2,
        },
      });

      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      const { workspace_id } = this.clickfunnels.$auth;

      await axios(this, {
        method: "DELETE",
        url: `${this.clickfunnels._baseUrl()}/workspaces/${workspace_id}/webhooks/outgoing/endpoints/${webhookId}`,
        headers: {
          Authorization: `Bearer ${this.clickfunnels.$auth.oauth_access_token}`,
        },
      });
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const rawBody = JSON.stringify(body);
    const webhookSignature = headers["x-clickfunnels-signature"];
    const secretKey = this.clickfunnels.$auth.signing_secret;

    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("hex");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    await this.clickfunnels.handleSubscriptionInvoicePaid(body);

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
