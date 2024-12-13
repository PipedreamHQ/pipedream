import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-new-billing-subscription",
  name: "New Billing Subscription Created",
  description: "Emit new event when a billing subscription is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pennylane: {
      type: "app",
      app: "pennylane",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    billingSubscriptionFilters: {
      propDefinition: [
        "pennylane",
        "billingSubscriptionFilters",
      ],
    },
  },
  hooks: {
    async deploy() {
      const filters = this.billingSubscriptionFilters.length
        ? JSON.stringify(this.billingSubscriptionFilters.map((filter) => JSON.parse(filter)))
        : undefined;

      const params = {};
      if (filters) params.filter = filters;

      const subscriptions = await this.pennylane.paginate(
        this.pennylane.listBillingSubscriptions,
        {
          params,
        },
      );

      const latestSubscriptions = subscriptions.slice(-50).reverse();

      for (const sub of latestSubscriptions) {
        this.$emit(
          sub,
          {
            id: sub.id.toString(),
            summary: `New Billing Subscription: ${sub.id}`,
            ts: sub.start
              ? new Date(sub.start).getTime()
              : Date.now(),
          },
        );
      }

      const lastTimestamp = latestSubscriptions.length > 0
        ? Math.max(...latestSubscriptions.map((sub) => sub.start
          ? new Date(sub.start).getTime()
          : 0))
        : Date.now();

      await this.db.set("lastTimestamp", lastTimestamp);
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook teardown required for polling source
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;

    const filters = this.billingSubscriptionFilters.length
      ? JSON.stringify(this.billingSubscriptionFilters.map((filter) => JSON.parse(filter)))
      : undefined;

    const params = {};
    if (filters) params.filter = filters;

    const subscriptions = await this.pennylane.paginate(
      this.pennylane.listBillingSubscriptions,
      {
        params,
      },
    );

    const newSubscriptions = subscriptions.filter((sub) => {
      const ts = sub.start
        ? new Date(sub.start).getTime()
        : Date.now();
      return ts > lastTimestamp;
    });

    for (const sub of newSubscriptions) {
      this.$emit(
        sub,
        {
          id: sub.id.toString(),
          summary: `New Billing Subscription: ${sub.id}`,
          ts: sub.start
            ? new Date(sub.start).getTime()
            : Date.now(),
        },
      );
    }

    if (newSubscriptions.length > 0) {
      const newLastTimestamp = Math.max(
        ...newSubscriptions.map((sub) => sub.start
          ? new Date(sub.start).getTime()
          : 0),
      );
      await this.db.set("lastTimestamp", newLastTimestamp);
    }
  },
};
