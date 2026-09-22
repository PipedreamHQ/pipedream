import splunk from "../../splunk.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "splunk-new-alert-fired",
  name: "New Alert Fired (Instant)",
  description: "Emit new event when a new alert is triggered in Splunk. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#alerts.2Ffired_alerts)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    splunk,
    http: "$.interface.http",
    db: "$.service.db",
    savedSearchName: {
      propDefinition: [
        splunk,
        "savedSearchName",
      ],
    },
  },
  hooks: {
    async activate() {
      const response = await this.updateSavedSearch({
        "action.webhook": 1,
        "action.webhook.param.url": this.http.endpoint,
      });
      if (!response) {
        throw new Error("Error creating webhook");
      }
    },
    async deactivate() {
      const response = await this.updateSavedSearch({
        "action.webhook": 0,
      });
      if (!response) {
        throw new Error("Error disabling webhook");
      }
    },
  },
  methods: {
    async updateSavedSearch(data) {
      try {
        return await this.splunk._makeRequest({
          method: "POST",
          path: `/saved/searches/${encodeURIComponent(this.savedSearchName)}`,
          data: new URLSearchParams(data),
        });
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
    generateMeta(alert) {
      const ts = +alert.result._time;
      return {
        id: ts,
        summary: `New Alert Fired for Source: ${alert.result.source}`,
        ts,
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
  sampleEmit,
};
