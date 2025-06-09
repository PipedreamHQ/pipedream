import picqer from "../../picqer.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-new-order-instant",
  name: "New Order Instant",
  description: "Emit new event when a new order is created in Picqer. [See the documentation](https://picqer.com/en/api/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    picqer,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    warehouseId: {
      propDefinition: [
        picqer,
        "warehouseId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const orders = await this.picqer._makeRequest({
        path: "/orders",
        method: "GET",
        params: {
          results: 50,
          sort: "created_at:desc",
        },
      });
      for (const order of orders) {
        this.$emit(order, {
          id: order.idorder,
          summary: `New order: ${order.orderid}`,
          ts: Date.parse(order.created_at),
        });
      }
    },
    async activate() {
      const webhook = await this.picqer._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "orders.created",
          url: this.http.endpoint,
          secret: this.picqer.$auth.api_key,
          warehouse_id: this.warehouseId,
        },
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.picqer._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  async run(event) {
    const webhookSignature = event.headers["x-picqer-signature"];
    const rawBody = event.bodyRaw;
    const secretKey = this.picqer.$auth.api_key;
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const data = event.body;
    this.$emit(data, {
      id: data.idorder,
      summary: `New order created: ${data.orderid}`,
      ts: Date.parse(data.created_at),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
