import knorish from "../../knorish.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "knorish-bundle-purchased",
  name: "Bundle Purchased",
  description: "Emit new event when a bundle is purchased by a user. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    knorish,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    userId: {
      propDefinition: [
        knorish,
        "userId",
      ],
    },
    bundleId: {
      propDefinition: [
        knorish,
        "bundleId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit 50 most recent bundle purchase events
      const purchases = await this.knorish.getBundles({
        userId: this.userId,
      });
      purchases.slice(0, 50).forEach((purchase) => {
        this.$emit(purchase, {
          id: purchase.id,
          summary: `User ${purchase.userId} purchased bundle ${purchase.bundleId}`,
          ts: Date.parse(purchase.createdAt), // Assuming there's a createdAt field
        });
      });
      // Store the latest purchase date for future polling
      if (purchases.length > 0) {
        this.db.set("lastCheckedAt", Date.parse(purchases[0].createdAt));
      }
    },
  },
  methods: {},
  async run() {
    // Fetch new bundle purchases since the last check
    const lastCheckedAt = this.db.get("lastCheckedAt") || 0;
    const purchases = await this.knorish.getBundles({
      userId: this.userId,
    });
    const newPurchases = purchases.filter((purchase) => {
      return Date.parse(purchase.createdAt) > lastCheckedAt;
    });

    // Emit new purchase events and update the last checked timestamp
    if (newPurchases.length > 0) {
      const latestPurchase = newPurchases[0];
      this.db.set("lastCheckedAt", Date.parse(latestPurchase.createdAt));
      newPurchases.forEach((purchase) => {
        this.$emit(purchase, {
          id: purchase.id,
          summary: `User ${purchase.userId} purchased bundle ${purchase.bundleId}`,
          ts: Date.parse(purchase.createdAt),
        });
      });
    }
  },
};
