const here = require("../../here.app.js");
const { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } = require("@pipedream/platform");

module.exports = {
  name: "Weather for ZIP Code",
  version: "0.0.3",
  key: "here-weather-for-zip",
  description: "Emits the weather report for a specific ZIP code on a schedule",
  type: "source",
  props: {
    here,
    zipCode: {
      propDefinition: [
        here,
        "zipCode",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const report = await this.here.returnReportForZIP(this.zipCode);
    this.$emit(report, {
      summary: `Weather report for ${this.zipCode} at ${report.feedCreation}`,
      ts: Date.now(),
    });
  },
};
