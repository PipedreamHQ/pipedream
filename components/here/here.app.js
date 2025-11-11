module.exports = {
  type: "app",
  app: "here",
  propDefinitions: {
    zipCode: {
      type: "integer",
      label: "ZIP code",
      description:
        "The ZIP code you'd like to pull weather stats for (only supported for locations in the United States)",
    },
  },
  methods: {
    _apiUrl() {
      return "https://weather.ls.hereapi.com/weather/1.0";
    },
    _apiKey() {
      return this.$auth.apikey;
    },
    async returnReportForZIP(zipCode) {
      const baseUrl = this._apiUrl();
      return await require("@pipedream/platform").axios(this, {
        url: `${baseUrl}/report.json?apiKey=${this._apiKey()}&product=observation&zipcode=${zipCode}`,
      });
    },
  },
};
