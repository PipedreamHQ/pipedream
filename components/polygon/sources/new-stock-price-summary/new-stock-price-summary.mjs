import polygon from "../../polygon.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "polygon-new-stock-price-summary",
  name: "New Stock Price Summary",
  description: "Emit a new event when the daily price summary (open, high, low, close) for a specified stock ticker is available. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    polygon: {
      type: "app",
      app: "polygon",
    },
    db: "$.service.db",
    stockTicker: {
      propDefinition: [
        polygon,
        "stockTicker",
      ],
    },
    timeInterval: {
      propDefinition: [
        polygon,
        "timeInterval",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      try {
        const summaries = [];
        const today = new Date();
        const toDate = today.toISOString().split("T")[0];

        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 50);
        const fromDate = pastDate.toISOString().split("T")[0];

        // Fetch historical price data for the past 50 days
        const historicalData = await this.polygon.getHistoricalPriceData({
          fromDate,
          toDate,
        });

        // Assume historicalData returns an array of summaries sorted from oldest to newest
        // Reverse to have most recent first
        const sortedSummaries = historicalData.reverse();

        const latestSummaries = sortedSummaries.slice(0, 50);

        for (const summary of latestSummaries) {
          if (summary && summary.open !== undefined) {
            const summaryData = {
              symbol: this.stockTicker,
              open: summary.open,
              high: summary.high,
              low: summary.low,
              close: summary.close,
            };
            const ts = Date.parse(summary.date) || Date.now();
            this.$emit(summaryData, {
              summary: `Daily price summary for ${this.stockTicker} on ${summary.date}`,
              ts,
            });
            await this.db.set("lastSummary", summary.date);
          }
        }
      } catch (error) {
        console.error("Error during deploy hook:", error);
      }
    },
    async activate() {
      // No activation steps needed for polling source
    },
    async deactivate() {
      // No deactivation steps needed for polling source
    },
  },
  async run() {
    try {
      const lastSummary = await this.db.get("lastSummary");
      const summary = await this.polygon.getDailyPriceSummary();

      if (summary && summary.date && summary.date !== lastSummary) {
        const summaryData = {
          symbol: this.stockTicker,
          open: summary.open,
          high: summary.high,
          low: summary.low,
          close: summary.close,
        };
        const ts = Date.parse(summary.date) || Date.now();
        this.$emit(summaryData, {
          summary: `New daily price summary for ${this.stockTicker} on ${summary.date}`,
          ts,
        });
        await this.db.set("lastSummary", summary.date);
      }
    } catch (error) {
      console.error("Error during run method:", error);
    }
  },
};
