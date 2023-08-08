import crypto from "crypto";

export default {
  key: "woocommerce-new-order-event",
  name: "New Order Event (Instant)",
  description: "Emit new event each time the specified order event(s) occur",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    woocommerce: {
      type: "app",
      app: "woocommerce",
    },
    db: "$.service.db",
    http: "$.interface.http",
    topics: {
      type: "string[]",
      label: "Event topics",
      description: "Types of events to watch for",
      options: [
        "created",
        "updated",
        "deleted",
      ],
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getSampleEvents({
        perPage: 25,
      });
      for (const event of events) {
        const meta = this.generateMeta("", event);
        this.$emit(event, meta);
      }
    },
    async activate() {
      const hookIds = [];
      for (const topicType of this.topics) {
        const topic = this.getTopic(topicType);
        const data = {
          topic,
          delivery_url: this.http.endpoint,
          secret: this.woocommerce.$auth.secret,
        };
        const { id } = await this.woocommerce.createWebhook(data);
        hookIds.push(id);
      }
      this._setHookIds(hookIds);
    },
    async deactivate() {
      const hookIds = this._getHookIds();
      await Promise.all(hookIds.map(async (id) => await this.woocommerce.deleteWebhook(id)));
      this._setHookIds(null);
    },
  },
  methods: {
    _getHookIds() {
      return this.db.get("hookIds");
    },
    _setHookIds(hookIds) {
      this.db.set("hookIds", hookIds);
    },
    verifyWebhookRequest(bodyRaw, signature) {
      const signatureComputed = crypto.createHmac("SHA256", this.woocommerce.$auth.secret)
        .update(bodyRaw)
        .digest("base64");
      return signatureComputed === signature;
    },
    async getSampleEvents({ perPage }) {
      return this.woocommerce.listOrders({
        per_page: perPage,
        orderby: "date",
      });
    },
    getTopic(topicType) {
      return `order.${topicType}`;
    },
    generateMeta(eventType, {
      id, date_modified: dateModified,
    }) {
      const ts = Date.parse(dateModified);
      return {
        id: `${id}${ts}`,
        summary: `Order ID: ${id} ${eventType}`,
        ts,
      };
    },
  },
  async run(event) {
    const {
      body,
      bodyRaw,
      headers,
    } = event;

    // WooCommerce sends a request verifying the webhook that contains only the webhook_id.
    // We can skip these requests.
    if (body.webhook_id) {
      return;
    }

    // verify that the incoming webhook is valid
    if (!this.verifyWebhookRequest(bodyRaw, headers["x-wc-webhook-signature"])) {
      console.log("Could not verify incoming webhook signature");
      return;
    }

    const eventType = headers["x-wc-webhook-event"];
    if (eventType) {
      const meta = this.generateMeta(eventType, body);
      this.$emit(body, meta);
    }
  },
};
