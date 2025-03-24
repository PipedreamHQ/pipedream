import splunk from "../../splunk.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "splunk-new-alert-fired",
  name: "New Alert Fired (Instant)",
  description: "Emit new event when a new alert is triggered in Splunk. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#alerts.2Ffired_alerts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    splunk,
    http: "$.interface.http",
  },
  methods: {
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
