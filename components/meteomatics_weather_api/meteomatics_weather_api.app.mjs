import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "meteomatics_weather_api",
  propDefinitions: {
    validDateTime: {
      type: "string[]",
      label: "Valid Date Time",
      description: "A date or date range to retrieve the weather forecast for, i.e. `2017-05-28T13:00:00Z`",
    },
    parameters: {
      type: "string[]",
      label: "Parameters",
      description: "One or more parameters to be included in this request",
      options: constants.PARAMETERS,
    },
    locations: {
      type: "string",
      label: "Location",
      description: "Geo-coordinates (latitude and longitude) in WGS-84 decimal format, i.e. `47.419708,9.358478`",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The data format of the output",
      options: constants.FORMATS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.meteomatics.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          access_token: `${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getWeatherData({
      validdatetime, parameters, locations, format, ...args
    }) {
      return this._makeRequest({
        path: `/${validdatetime}/${parameters}/${locations}/${format}`,
        ...args,
      });
    },
  },
};
