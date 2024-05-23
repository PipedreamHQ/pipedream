import { axios } from "@pipedream/platform";
import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-new-data",
  name: "New Data Available",
  description: "Emit new event when fresh data is available for a specific collection.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    upbooks,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    collectionName: {
      propDefinition: [
        upbooks,
        "collectionName",
      ],
    },
    timeInterval: {
      propDefinition: [
        upbooks,
        "timeInterval",
        (c) => ({
          optional: true,
          default: 60,
        }), // Default to 60 minutes if not specified
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data on deploy
      await this.fetchAndEmitData(true);
    },
  },
  methods: {
    async fetchAndEmitData(isDeploy = false) {
      const lastEmittedTimestamp = isDeploy
        ? 0
        : this.db.get("lastEmittedTimestamp") || Date.now() - (this.timeInterval * 60 * 1000);
      const currentTime = Date.now();
      const newEvents = await this.upbooks.emitNewDataEvent({
        collectionName: this.collectionName,
        timeInterval: this.timeInterval,
      });

      newEvents.forEach((event) => {
        const eventTimestamp = Date.parse(event.timestamp);
        if (eventTimestamp > lastEmittedTimestamp) {
          this.$emit(event, {
            id: event.id || `${eventTimestamp}-${Math.random()}`,
            summary: `New data in ${this.collectionName}`,
            ts: eventTimestamp,
          });
        }
      });

      this.db.set("lastEmittedTimestamp", currentTime);
    },
  },
  async run() {
    await this.fetchAndEmitData();
  },
};
