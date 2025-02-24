import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "geoapify",
  propDefinitions: {
    locationType: {
      type: "string",
      label: "Type",
      description: "The location type. If set to `locality`, returns administrative areas including postcodes, districts, cities, counties, and states.",
      options: constants.LOCATION_TYPES,
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the response, default value is `geojson`",
      options: constants.FORMATS,
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The mode of transportation",
      options: constants.TRANSPORTATION_MODES,
    },
    routeOptimizationType: {
      type: "string",
      label: "Type",
      description: "The route optimization type",
      options: constants.ROUTE_OPTIMIZATION_TYPES,
      optional: true,
    },
    units: {
      type: "string",
      label: "Units",
      description: "Distance units for the calculated route, the default value is `metric`",
      options: constants.UNITS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.geoapify.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          apiKey: this.$auth.api_key,
        },
      });
    },
    geocodeAddress(opts = {}) {
      return this._makeRequest({
        path: "/geocode/search",
        ...opts,
      });
    },
    calculateRoute(opts = {}) {
      return this._makeRequest({
        path: "/routing",
        ...opts,
      });
    },
    geolocateIP(opts = {}) {
      return this._makeRequest({
        path: "/ipinfo",
        ...opts,
      });
    },
  },
};
