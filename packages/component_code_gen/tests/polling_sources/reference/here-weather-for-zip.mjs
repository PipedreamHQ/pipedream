const { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } = require("@pipedream/platform");

module.exports = {
  name: "Weather for ZIP Code",
  version: "0.0.3",
  key: "here-weather-for-zip",
  description: "Emits the weather report for a specific ZIP code on a schedule",
  type: "source",
  props: {
    here: {
      type: "app",
      app: "here",
    },
    zipCode: {
      type: "integer",
      label: "ZIP code",
      description: "The ZIP code you'd like to pull weather stats for (only supported for locations in the United States)",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://weather.ls.hereapi.com/weather/1.0";
    },
    _apiKey() {
      return this.here.$auth.apikey;
    },
    async returnReportForZIP(zipCode) {
      const baseUrl = this._apiUrl();
      return await require("@pipedream/platform").axios(this, {
        url: `${baseUrl}/report.json?apiKey=${this._apiKey()}&product=observation&zipcode=${zipCode}`,
      });
    },
  },
  async run() {
    const report = await this.returnReportForZIP(this.zipCode);
    this.$emit(report, {
      summary: `Weather report for ${this.zipCode} at ${report.feedCreation}`,
      ts: Date.now(),
    });
  },
};
