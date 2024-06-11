import { axios } from "@pipedream/platform";
import acymailing from "../../acymailing.app.mjs";

export default {
  key: "acymailing-new-subscribed-user",
  name: "New Subscribed User",
  description: "Emits an event when a user subscribes to one or more specified list(s).",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    acymailing,
    db: "$.service.db",
    lists: {
      propDefinition: [
        acymailing,
        "lists",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    async fetchSubscriptions(listIds, lastExecutionTime) {
      const subscriptions = await this.acymailing.subscribeUserToLists(null, listIds);
      return subscriptions.filter((subscription) => new Date(subscription.subscription_date) > new Date(lastExecutionTime));
    },
  },
  hooks: {
    async activate() {
      this.db.set("lastExecutionTime", Date.now() - 1000 * 60 * 15); // Set initial state 15 minutes ago
    },
  },
  async run() {
    const lastExecutionTime = this.db.get("lastExecutionTime");
    const currentTime = Date.now();
    const listIds = this.lists.join(",");

    const subscriptions = await this.fetchSubscriptions(listIds, lastExecutionTime);

    subscriptions.forEach((subscription) => {
      this.$emit(subscription, {
        id: subscription.id,
        summary: `New Subscriber: ${subscription.name} (${subscription.email})`,
        ts: Date.parse(subscription.subscription_date),
      });
    });

    this.db.set("lastExecutionTime", currentTime);
  },
};
