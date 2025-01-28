import printful from "../../printful.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "printful-order-status-updated-instant",
  name: "Order Status Updated (Instant)",
  description: "Emit new event when the status of an existing Printful order is updated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    printful: {
      type: "app",
      app: "printful",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    orderStatusFilter: {
      propDefinition: [
        "printful",
        "orderStatusFilter",
      ],
      optional: true,
    },
    fulfillmentLocationFilter: {
      propDefinition: [
        "printful",
        "fulfillmentLocationFilter",
      ],
      optional: true,
    },
    orderUpdateStatusFilter: {
      propDefinition: [
        "printful",
        "orderUpdateStatusFilter",
      ],
      optional: true,
    },
  },
  methods: {
    async _getWebhookId() {
      return await this.db.get("webhookId");
    },
    async _setWebhookId(id) {
      await this.db.set("webhookId", id);
    },
    _validateSignature(rawBody, signature) {
      const computedSignature = crypto
        .createHmac("sha256", this.printful.$auth.api_key)
        .update(rawBody)
        .digest("hex");
      return computedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      const params = {};
      if (this.orderStatusFilter) {
        params.status = this.orderStatusFilter;
      }
      if (this.fulfillmentLocationFilter) {
        params.location = this.fulfillmentLocationFilter;
      }
      if (this.orderUpdateStatusFilter) {
        params.status_update = this.orderUpdateStatusFilter;
      }
      const orders = await this.printful.listOrders({
        params,
      });
      const recentOrders = orders.slice(-50).reverse();
      for (const order of recentOrders) {
        this.$emit(order, {
          id: order.id.toString(),
          summary: `Order ${order.id} status updated to ${order.status}`,
          ts: new Date(order.updated_at).getTime(),
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const events = [
        "order.status_updated",
      ];
      const payload = {
        url: webhookUrl,
        events: events,
      };
      const response = await this.printful._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: payload,
      });
      const webhookId = response.id;
      await this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this.printful._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const rawBody = event.body;
    const signature = event.headers["X-Printful-Signature"];
    const isValid = this._validateSignature(rawBody, signature);
    if (!isValid) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const orderUpdate = JSON.parse(rawBody);
    if (
      (this.orderUpdateStatusFilter &&
        !this.orderUpdateStatusFilter.includes(orderUpdate.status)) ||
      (this.orderStatusFilter &&
        !this.orderStatusFilter.includes(orderUpdate.status)) ||
      (this.fulfillmentLocationFilter &&
        !this.fulfillmentLocationFilter.includes(orderUpdate.location))
    ) {
      return;
    }
    this.$emit(orderUpdate, {
      id: orderUpdate.id.toString(),
      summary: `Order ${orderUpdate.id} status updated to ${orderUpdate.status}`,
      ts: new Date(orderUpdate.updated_at).getTime(),
    });
  },
};
