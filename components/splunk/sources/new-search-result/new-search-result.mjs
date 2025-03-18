import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import splunkApp from "../../splunk.app.mjs";

export default {
  key: "splunk-new-search-result",
  name: "New Search Result in Splunk",
  description: "Emit new events when a search query returns matching results in Splunk. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    splunk: {
      type: "app",
      app: "splunk",
    },
    db: {
      type: "$.service.db",
    },
    query: {
      propDefinition: [
        splunkApp,
        "query",
      ],
    },
    pollingInterval: {
      propDefinition: [
        splunkApp,
        "pollingInterval",
      ],
      optional: true,
      default: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: "$pollingInterval",
      },
    },
  },
  methods: {
    /**
     * Executes the Splunk search query within the specified time range.
     * @param {string} query - The Splunk search query.
     * @param {string} earliestTime - The earliest time for the search.
     * @param {string} latestTime - The latest time for the search.
     * @returns {Promise<Array>} - An array of search results.
     */
    async executeSearch(query, earliestTime, latestTime) {
      const searchResponse = await this.splunk.executeSearchQuery({
        query,
        earliestTime,
        latestTime,
      });

      const jobId = searchResponse.sid;

      let jobStatus = await this.splunk.getSearchJobStatus({
        jobId,
      });
      const maxRetries = 30;
      let retries = 0;
      const pollInterval = 2000; // 2 seconds

      while (jobStatus.status !== "DONE" && retries < maxRetries) {
        await this.$sleep(pollInterval);
        jobStatus = await this.splunk.getSearchJobStatus({
          jobId,
        });
        retries += 1;
      }

      if (jobStatus.status !== "DONE") {
        throw new Error(`Search job ${jobId} did not complete within the expected time.`);
      }

      const results = await this.splunk.getSearchResults({
        jobId,
      });
      return results.results;
    },

    /**
     * Retrieves the last run timestamp from the database.
     * @returns {string} - ISO timestamp.
     */
    async getLastRunTime() {
      const lastRun = await this.db.get("lastRunTime");
      if (lastRun) {
        return lastRun;
      }
      const now = new Date();
      now.setSeconds(now.getSeconds() - (
        this.pollingInterval || DEFAULT_POLLING_SOURCE_TIMER_INTERVAL));
      return now.toISOString();
    },

    /**
     * Updates the last run timestamp in the database.
     * @param {string} timestamp - ISO timestamp.
     */
    async updateLastRunTime(timestamp) {
      await this.db.set("lastRunTime", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const latestTime = new Date().toISOString();
      const earliestTime = await this.getLastRunTime();

      try {
        const results = await this.executeSearch(this.query, earliestTime, latestTime);

        for (const result of results.slice(-50).reverse()) {
          const eventId = result._raw
            ? result._raw.toString()
            : latestTime;
          const eventSummary = result._raw
            ? result._raw.substring(0, 100)
            : "New Splunk Search Result";
          const eventTimestamp = result._time
            ? new Date(result._time).getTime()
            : Date.now();

          this.$emit(result, {
            id: eventId,
            summary: eventSummary,
            ts: eventTimestamp,
          });
        }

        await this.updateLastRunTime(latestTime);
      } catch (error) {
        this.$emit({
          error: error.message,
        }, {
          summary: "Error during deploy hook",
          ts: Date.now(),
        });
        throw error;
      }
    },

    async activate() {
      // No webhook setup required for polling
    },

    async deactivate() {
      // No webhook teardown required for polling
    },
  },
  async run() {
    try {
      const latestTime = new Date().toISOString();
      const earliestTime = await this.getLastRunTime();

      const results = await this.executeSearch(this.query, earliestTime, latestTime);

      if (results.length === 0) {
        return;
      }

      for (const result of results) {
        const eventId = result._raw
          ? result._raw.toString()
          : latestTime;
        const eventSummary = result._raw
          ? result._raw.substring(0, 100)
          : "New Splunk Search Result";
        const eventTimestamp = result._time
          ? new Date(result._time).getTime()
          : Date.now();

        this.$emit(result, {
          id: eventId,
          summary: eventSummary,
          ts: eventTimestamp,
        });
      }

      await this.updateLastRunTime(latestTime);
    } catch (error) {
      this.$emit({
        error: error.message,
      }, {
        summary: "Error executing Splunk search",
        ts: Date.now(),
      });
      throw error;
    }
  },
};
