import { axios } from "@pipedream/platform";
import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-new-scrape-error",
  name: "New Scrape Job Error",
  description: "Emit new event when a scrape job fails or returns an error. [See the documentation](https://apidocs.scrapeless.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    scrapeless,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    scrapeJobId: {
      propDefinition: [
        scrapeless,
        "scrapeJobId",
      ],
    },
  },
  methods: {
    async monitorScrapeJob() {
      try {
        const result = await this.scrapeless.getScrapeResult({
          scrapeJobId: this.scrapeJobId,
        });
        if (result.state === "failed") {
          this.$emit({
            error: result.error || "Unknown error",
            scrapeJobId: this.scrapeJobId,
          }, {
            id: result.taskId,
            summary: `Scrape job ${this.scrapeJobId} failed`,
            ts: Date.now(),
          });
        }
      } catch (error) {
        this.$emit({
          error: error.message,
          scrapeJobId: this.scrapeJobId,
        }, {
          summary: `Scrape job error: ${this.scrapeJobId}`,
          ts: Date.now(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.monitorScrapeJob();
    },
    async activate() {
      console.log("Source activated");
    },
    async deactivate() {
      console.log("Source deactivated");
    },
  },
  async run() {
    await this.monitorScrapeJob();
  },
};
