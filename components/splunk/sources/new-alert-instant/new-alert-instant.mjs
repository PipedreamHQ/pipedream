import splunk from "../../splunk.app.mjs";

export default {
  key: "splunk-new-alert-instant",
  name: "Splunk New Alert (Instant)",
  description: "Emit new event when a saved search alert is triggered in Splunk. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    splunk,
    alertName: {
      propDefinition: [
        "splunk",
        "alertName",
      ],
    },
    pollingInterval: {
      propDefinition: [
        "splunk",
        "pollingInterval",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const currentTime = Math.floor(Date.now() / 1000);
      const lastRunTime = currentTime - (this.pollingInterval || 60);
      await this.db.set("lastRunTime", lastRunTime);
    },
    async activate() {
      // No webhook creation needed for polling
    },
    async deactivate() {
      // No webhook deletion needed for polling
    },
  },
  methods: {
    async getSearchResults(jobId) {
      let results = [];
      let offset = 0;
      const count = 100;

      while (true) {
        const response = await this.splunk._makeRequest({
          method: "GET",
          path: `search/jobs/${jobId}/results`,
          params: {
            count,
            offset,
            output_mode: "json",
          },
        });

        if (!response.results || response.results.length === 0) {
          break;
        }

        results = results.concat(response.results);
        offset += count;

        if (response.results.length < count) {
          break;
        }
      }

      return results;
    },
  },
  async run() {
    const lastRunTime = (await this.db.get("lastRunTime")) || 0;
    const currentTime = Math.floor(Date.now() / 1000);

    let query = `_time > ${lastRunTime}`;
    if (this.alertName) {
      query = `savedsearch="${this.alertName}" AND _time > ${lastRunTime}`;
    }

    const searchJob = await this.splunk.search({
      query,
      earliestTime: lastRunTime,
      latestTime: currentTime,
    });

    const jobId = searchJob.sid;

    let jobStatus;
    do {
      jobStatus = await this.splunk.getSearchJobStatus({
        jobId,
      });
      if (jobStatus.status === "DONE") break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (true);

    const results = await this.methods.getSearchResults(jobId);

    for (const result of results) {
      const eventData = result;

      this.$emit(eventData, {
        id: result._raw || JSON.stringify(result),
        summary: `Alert "${this.alertName || "All Alerts"}" triggered.`,
        ts: result._time
          ? result._time * 1000
          : Date.now(),
      });
    }

    await this.db.set("lastRunTime", currentTime);
  },
};
