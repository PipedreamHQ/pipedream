import splunk from "../../splunk.app.mjs";
import { exec } from "child_process";
import sampleEmit from "./test-event.mjs";

export default {
  key: "splunk-new-alert-fired",
  name: "New Alert Fired (Instant)",
  description: "Emit new event when a new alert is triggered in Splunk. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#alerts.2Ffired_alerts)",
  //version: "0.0.1",
  version: "0.0.{{ts}}",
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
      await this.updateSavedSearch(`-d action.webhook=1 -d action.webhook.param.url=${this.http.endpoint}`);
    },
    async deactivate() {
      await this.updateSavedSearch("-d action.webhook=0");
    },
  },
  methods: {
    async updateSavedSearch(data) {
      const cmd = `curl -X POST ${this.splunk._baseUrl()}/saved/searches/${this.savedSearchName} -k -H "Authorization: Bearer ${this.splunk.$auth.api_token}" ${data}`;
      await exec(cmd);
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
