import { axios } from "@pipedream/platform";
import linearb from "../../linearb.app.mjs";

export default {
  key: "linearb-new-pickup-created",
  name: "New Pickup Created",
  description: "Emits an event when a new pickup is created in LinearB. [See the documentation](https://linearb.helpdocs.io/search/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linearb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...linearb.methods,
  },
  hooks: {
    async deploy() {
      // Fetch and emit up to the last 50 pickups during deployment
      const initialPickups = await this.linearb.getPickups({
        limit: 50,
      });
      initialPickups.forEach((pickup) => {
        this.$emit(pickup, {
          id: pickup.id,
          summary: `New Pickup: ${pickup.summary}`,
          ts: pickup.timestamp,
        });
      });

      if (initialPickups.length) {
        const latestTimestamp = Math.max(...initialPickups.map((p) => p.timestamp));
        this.db.set("lastTimestamp", latestTimestamp);
      }
    },
  },
  async run() {
    // Fetch and emit new pickups since the last run
    const lastTimestamp = this.db.get("lastTimestamp") || 0;
    const newPickups = await this.linearb.getPickups({
      limit: 1,
      since: lastTimestamp,
    });

    newPickups.forEach((pickup) => {
      this.$emit(pickup, {
        id: pickup.id,
        summary: `New Pickup: ${pickup.summary}`,
        ts: pickup.timestamp,
      });
    });

    if (newPickups.length) {
      const latestTimestamp = Math.max(...newPickups.map((p) => p.timestamp));
      this.db.set("lastTimestamp", latestTimestamp);
    }
  },
};
