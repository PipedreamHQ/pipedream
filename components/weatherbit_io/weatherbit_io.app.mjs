import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "weatherbit_io",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.weatherbit.io/v2.0";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          key: this._apiKey(),
        },
      });
    },
    async fetchCurrentWeather(args = {}) {
      return this._makeRequest({
        path: "/current",
        ...args,
      });
    },
    async fetchDailyForecast(args = {}) {
      return this._makeRequest({
        path: "/forecast/daily",
        ...args,
      });
    },
    async fetchHistoricalWeatherData(args = {}) {
      return this._makeRequest({
        path: "/history/subhourly",
        ...args,
      });
    },
  },
};
