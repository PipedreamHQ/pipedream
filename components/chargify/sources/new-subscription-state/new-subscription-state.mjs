import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-new-subscription-state",
  name: "New Subscription State",
  description: "Emits an event when the state of a subscription changes",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    chargify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // check every 15 minutes
      }, 
    },
    subscriptionId: {
      propDefinition: [chargify, "subscriptionId"],
    },
  },

  methods: {
    _getSubscription() {
      return this.chargify.getSubscriptions({
        subscriptionId: this.subscriptionId,
      });
    },
  },

  hooks: {
    async deploy() {
      // get the current state of the subscription
      const subscription = await this._getSubscription();
      this.db.set("currentState", subscription.state);
    },
  },

  async run() {
    const subscription = await this._getSubscription();
    const currentState = this.db.get("currentState");
    
    // check if state has changed
    if (subscription.state !== currentState) {
      this.$emit(subscription, {
        id: subscription.id,
        summary: `Subscription state changed to ${subscription.state}`,
        ts: Date.now(),
      });
      this.db.set("currentState", subscription.state);
    }
  },
};