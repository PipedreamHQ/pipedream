const here = require('../../here.app.js');

module.exports = {
  name: 'Weather for ZIP Code',
  version: '0.0.2',
  key: 'here-weather-for-zip',
  description: 'Emits the weather report for a specific ZIP code on a schedule',
  props: {
    here,
    zipCode: { propDefinition: [here, 'zipCode'] },
    timer: {
      type: '$.interface.timer',
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  async run(event) {
    const report = await this.here.returnReportForZIP(this.zipCode);
    this.$emit(report, {
      summary: `Weather report for ${this.zipCode} at ${report.feedCreation}`,
      ts: Date.now(),
    });
  },
};
