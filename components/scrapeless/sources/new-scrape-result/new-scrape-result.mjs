import scrapeless from "../../scrapeless.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "scrapeless-new-scrape-result",
  name: "New Scrape Result",
  description: "Emit new event when a scrape job completes and results are available. [See the documentation](https://apidocs.scrapeless.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    scrapeless,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    scrapeJobId: {
      propDefinition: [
        scrapeless,
        "scrapeJobId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.checkScrapeResult();
    },
    // Define activate and deactivate hooks for completeness
    async activate() {
      // No additional setup required
    },
    async deactivate() {
      // No teardown required
    },
  },
  methods: {
    async checkScrapeResult() {
      try {
        const result = await this.scrapeless.getScrapeResult({
          scrapeJobId: this.scrapeJobId,
        });
        if (result.state === "completed") {
          this.$emit(result, {
            id: this.scrapeJobId,
            summary: `Scrape job completed for ID: ${this.scrapeJobId}`,
            ts: new Date().getTime(),
          });
        }
      } catch (error) {
        console.error(`Error fetching results for scrapeJobId: ${this.scrapeJobId}`, error);
        throw error;
      }
    },
  },
  async run() {
    await this.checkScrapeResult();
  },
};
