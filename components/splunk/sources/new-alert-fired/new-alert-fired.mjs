import common from "../common/base.mjs";

export default {
  ...common,
  key: "splunk-new-alert-fired",
  name: "New Alert Fired",
  description: "Emit new event when a new alert is triggered in Splunk. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#alerts.2Ffired_alerts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(alert) {
      return {
        id: alert.id,
        summary: `New Alert Fired: ${alert.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const results = this.splunk.paginate({
      resourceFn: this.splunk.listFiredAlerts,
    });

    const alerts = [];
    for await (const item of results) {
      alerts.push(item);
    }

    alerts.forEach((alert) => {
      const meta = this.generateMeta(alert);
      this.$emit(alert, meta);
    });
  },
};
