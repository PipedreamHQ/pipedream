import { axios } from "@pipedream/platform";
import agiledApp from "../../agiled.app.mjs";

export default {
  key: "agiled-new-estimate-created",
  name: "New Estimate Created",
  description: "Emits an event when a new estimate is created in Agiled.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agiledApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetching the last 50 estimates to avoid duplicates on the first run
      const lastEstimates = await this.agiledApp._makeRequest({
        method: "GET",
        path: "/estimates",
        params: {
          page: 1,
          per_page: 50,
        },
      });

      lastEstimates.reverse().slice(0, 50)
        .forEach((estimate) => {
          this.$emit(estimate, {
            id: estimate.id,
            summary: `New Estimate: ${estimate.estimate_number}`,
            ts: Date.parse(estimate.created_at),
          });
        });

      // Set the last emitted date to avoid duplicates on the next run
      if (lastEstimates.length > 0) {
        this.db.set("lastEmittedDate", new Date(lastEstimates[0].created_at).toISOString());
      }
    },
  },
  async run() {
    const lastEmittedDate = this.db.get("lastEmittedDate") || new Date().toISOString();

    // Fetching the latest estimates since the last emitted date
    const newEstimates = await this.agiledApp._makeRequest({
      method: "GET",
      path: "/estimates",
      params: {
        page: 1,
        per_page: 50,
        sort: "desc",
        min_date: lastEmittedDate,
      },
    });

    newEstimates.forEach((estimate) => {
      this.$emit(estimate, {
        id: estimate.id,
        summary: `New Estimate: ${estimate.estimate_number}`,
        ts: Date.parse(estimate.created_at),
      });
    });

    // Update the lastEmittedDate to the most recent estimate's created_at date
    if (newEstimates.length > 0) {
      this.db.set("lastEmittedDate", new Date(newEstimates[0].created_at).toISOString());
    }
  },
};
