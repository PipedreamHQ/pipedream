js;
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import Flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-new-subscription",
  name: "New Subscription",
  description: "Emit new event when a new subscription is added.",
  version: "0.0.{{{{ts}}}}",
  type: "source",
  dedupe: "unique",
  props: {
    flutterwave: Flutterwave,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    bank: {
      propDefinition: [
        Flutterwave,
        "bank",
      ],
    },
    currency: {
      propDefinition: [
        Flutterwave,
        "currency",
      ],
    },
    payoutSubaccount: {
      propDefinition: [
        Flutterwave,
        "payoutSubaccount",
      ],
    },
    transaction: {
      propDefinition: [
        Flutterwave,
        "transaction",
      ],
    },
  },
  methods: {
    _getLastSubscriptionId() {
      return this.db.get("lastSubscriptionId");
    },
    _setLastSubscriptionId(id) {
      this.db.set("lastSubscriptionId", id);
    },
  },
  async run() {
    let lastSubscriptionId = this._getLastSubscriptionId();
    let hasMore = true;

    while (hasMore) {
      const subscriptions = await this.flutterwave._makeRequest({
        method: "GET",
        path: "/subscriptions",
        params: lastSubscriptionId
          ? {
            id: lastSubscriptionId,
          }
          : {},
      });

      for (const subscription of subscriptions) {
        if (this.isRelevant(subscription, lastSubscriptionId)) {
          this.$emit(subscription, {
            id: subscription.id,
            summary: `New Subscription: ${subscription.plan_name}`,
            ts: Date.parse(subscription.created_at),
          });
          lastSubscriptionId = subscription.id;
        }
      }

      hasMore = subscriptions.length > 0;
      if (hasMore) {
        this._setLastSubscriptionId(lastSubscriptionId);
      }
    }
  },
  isRelevant(subscription, lastSubscriptionId) {
    return !lastSubscriptionId || subscription.id > lastSubscriptionId;
  },
};
