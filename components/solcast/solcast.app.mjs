import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "solcast",
  propDefinitions: {
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location",
    },
    hours: {
      type: "integer",
      label: "Hours",
      description: "Time window of the response in hours from 1 to 336",
      max: 336,
      optional: true,
    },
    period: {
      type: "string",
      label: "Period",
      description: "Length of the averaging period in ISO 8601 format. Default is `PT30M`",
      options: [
        "PT5M",
        "PT10M",
        "PT15M",
        "PT20M",
        "PT30M",
        "PT60M",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.solcast.com.au";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getLiveWeather(opts = {}) {
      return this._makeRequest({
        path: "/data/live/radiation_and_weather",
        ...opts,
      });
    },
    getWeatherForecast(opts = {}) {
      return this._makeRequest({
        path: "/data/forecast/radiation_and_weather",
        ...opts,
      });
    },
    getMonthlyAverages(opts = {}) {
      return this._makeRequest({
        path: "/monthly_averages",
        ...opts,
      });
    },
  },
};
