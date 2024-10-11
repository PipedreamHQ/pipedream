import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-new-subscription",
  name: "New Subscription",
  description: "Emit new event when a new subscription is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    chargify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    customerId: {
      propDefinition: [chargify, "customerId"],
    },
    subscriptionId: {
      propDefinition: [chargify, "subscriptionId"],
    },
    name: {
      propDefinition: [chargify, "name"],
    },
    email: {
      propDefinition: [chargify, "email"],
    },
    organization: {
      propDefinition: [chargify, "organization"],
    },
    productId: {
      propDefinition: [chargify, "productId"],
    },
    couponCode: {
      propDefinition: [chargify, "couponCode"],
    },
    nextBillingAt: {
      propDefinition: [chargify, "nextBillingAt"],
    },
  },
  methods: {
    _getSubscriptionId() {
      return this.db.get("subscriptionId");
    },
    _setSubscriptionId(id) {
      this.db.set("subscriptionId", id);
    },
  },
  async run() {
    const subscriptions = await this.chargify.getSubscriptions({
      customerId: this.customerId,
    });

    for (const subscription of subscriptions) {
      if (subscription.id > this._getSubscriptionId()) {
        this.$emit(subscription, {
          id: subscription.id,
          summary: `New subscription: ${subscription.name}`,
          ts: Date.now(),
        });
        this._setSubscriptionId(subscription.id);
      }
    }
  },
};