import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "accuweather",
  propDefinitions: {
    locationKey: {
      type: "string",
      label: "Location Key",
      description: "The location key for the desired location. You can get this using the 'Get Location Key' action.",
    },
  },
  methods: {
    _baseUrl() {
      return "http://dataservice.accuweather.com";
    },
    _params(params = {}) {
      return {
        apikey: `${this.$auth.api_key}`,
        ...params,
      };
    },
    _makeRequest({
      $ = this, params, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    searchLocation(opts = {}) {
      return this._makeRequest({
        path: "/locations/v1/search",
        ...opts,
      });
    },
    getCurrentConditions({
      locationKey, ...opts
    }) {
      return this._makeRequest({
        path: `/currentconditions/v1/${locationKey}`,
        ...opts,
      });
    },
    getDailyForecast({
      days, locationKey, ...opts
    }) {
      return this._makeRequest({
        path: `/forecasts/v1/daily/${days}day/${locationKey}`,
        ...opts,
      });
    },
    getHourlyForecast({
      hours, locationKey, ...opts
    }) {
      return this._makeRequest({
        path: `/forecasts/v1/hourly/${hours}hour/${locationKey}`,
        ...opts,
      });
    },
    getHistoricalWeather({
      locationKey, time, ...opts
    }) {
      return this._makeRequest({
        path: `/currentconditions/v1/${locationKey}/historical${time === 24
          ? "/24"
          : ""}`,
        ...opts,
      });
    },
  },
};
