import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-new-subscription-instant",
  name: "New Subscription Instant",
  description: "Emits an event whenever a new subscription is purchased by a customer.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    recharge,
    db: "$.service.db",
    customerId: {
      propDefinition: [
        recharge,
        "customerId",
      ],
    },
    subscriptionId: {
      propDefinition: [
        recharge,
        "subscriptionId",
      ],
    },
    productId: {
      propDefinition: [
        recharge,
        "productId",
        (c) => ({
          customerId: c.customerId,
        }),
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...recharge.methods,
  },
  async run() {
    const lastExecuted = this.db.get("lastExecuted") || 0;
    const subscriptions = await this.recharge._makeRequest({
      path: "/subscriptions",
      params: {
        customer_id: this.customerId,
        created_at_min: new Date(lastExecuted).toISOString(),
      },
    });

    subscriptions.forEach((subscription) => {
      if (!this.productId || this.productId === subscription.product_id) {
        this.$emit(subscription, {
          id: subscription.id,
          summary: `New Subscription: ${subscription.product_title}`,
          ts: Date.parse(subscription.created_at),
        });
      }
    });

    this.db.set("lastExecuted", Date.now());
  },
};
