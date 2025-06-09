import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "picqer-new-shipment-instant",
  name: "New Shipment Created",
  description: "Emit a new event when a shipment is created for an order in Picqer. [See the documentation](https://picqer.com/en/api/webhooks)",
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
    carrier: {
      propDefinition: [
        picqer,
        "carrier",
      ],
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
  hooks: {
    async deploy() {
      const recentShipments = await this.picqer._makeRequest({
        path: "/shipments",
      });
      for (const shipment of recentShipments.slice(0, 50)) {
        const ts = Date.parse(shipment.created_at);
        this.$emit(shipment, {
          id: shipment.idshipment,
          summary: `New shipment created: ${shipment.idshipment}`,
          ts,
        });
      }
    },
    async activate() {
      const webhookResponse = await this.picqer._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "picklists.shipments.created",
          url: this.http.endpoint,
        },
      });
      this._setWebhookId(webhookResponse.id);
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
  async run(event) {
    const rawBody = event.body_raw;
    const webhookSignature = event.headers["x-picqer-signature"];
    const secretKey = this.picqer.$auth.api_key;
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const { body } = event;
    if (this.carrier && body.carrier !== this.carrier) {
      return;
    }

    this.$emit(body, {
      id: body.idshipment,
      summary: `New shipment created: ${body.idshipment}`,
      ts: Date.parse(body.created_at),
    });
  },
};
