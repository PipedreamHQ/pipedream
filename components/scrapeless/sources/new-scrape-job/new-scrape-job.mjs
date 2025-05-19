import scrapeless from "../../scrapeless.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "scrapeless-new-scrape-job",
  name: "New Scrape Job Submitted",
  description: "Emit new event when a new scrape job is submitted. [See the documentation](https://apidocs.scrapeless.com)",
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
    targetUrl: {
      propDefinition: [
        scrapeless,
        "targetUrl",
      ],
    },
    selectors: {
      propDefinition: [
        scrapeless,
        "selectors",
      ],
    },
  },
  methods: {
    _getLastJobId() {
      return this.db.get("lastJobId");
    },
    _setLastJobId(lastJobId) {
      this.db.set("lastJobId", lastJobId);
    },
  },
  hooks: {
    async deploy() {
      const response = await this.scrapeless.submitScrapeJob({
        targetUrl: this.targetUrl,
        selectors: this.selectors,
      });

      this.$emit(response, {
        id: response.id || new Date().getTime()
          .toString(),
        summary: `New scrape job submitted: ${response.data.actor || "unknown"}`,
        ts: Date.now(),
      });

      this._setLastJobId(response.data.actor);
    },
  },
  async run() {
    const lastJobId = this._getLastJobId();

    if (!lastJobId) {
      const response = await this.scrapeless.submitScrapeJob({
        targetUrl: this.targetUrl,
        selectors: this.selectors,
      });

      this.$emit(response, {
        id: response.id || new Date().getTime()
          .toString(),
        summary: `New scrape job submitted: ${response.data.actor || "unknown"}`,
        ts: Date.now(),
      });

      this._setLastJobId(response.data.actor);
    } else {
      setInterval(async () => {
        await this.scrapeless.monitorScrapeJob(lastJobId);
      }, this.timer.default.intervalSeconds * 1000);
    }
  },
};
