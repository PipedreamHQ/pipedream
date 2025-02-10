import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "geoapify",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Geocoding Props
    address: {
      type: "string",
      label: "Address",
      description: "The address to retrieve geocoding information for.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of geocoding request.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the response.",
      optional: true,
    },
    // Routing Props
    fromLatitude: {
      type: "string",
      label: "From Latitude",
      description: "The latitude of the starting point.",
    },
    fromLongitude: {
      type: "string",
      label: "From Longitude",
      description: "The longitude of the starting point.",
    },
    toLatitude: {
      type: "string",
      label: "To Latitude",
      description: "The latitude of the destination point.",
    },
    toLongitude: {
      type: "string",
      label: "To Longitude",
      description: "The longitude of the destination point.",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The mode of transportation.",
      optional: true,
    },
    units: {
      type: "string",
      label: "Units",
      description: "The units of measurement.",
      optional: true,
    },
    // IP Geolocation Props
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "The IP address to retrieve geographical coordinates for.",
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for the API
    _baseUrl() {
      return "https://api.geoapify.com";
    },
    // Method to make API requests
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        params = {},
        headers = {},
        ...otherOpts
      } = opts;
      const allParams = {
        ...params,
        apiKey: this.$auth.apiKey,
      };
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        params: allParams,
        headers: {
          ...headers,
        },
      });
    },
    // Geocoding Method
    async geocodeAddress({
      address, type, format,
    }) {
      const params = {
        text: address,
      };
      if (type) params.type = type;
      if (format) params.format = format;
      return this._makeRequest({
        path: "/v1/geocode/search",
        params,
      });
    },
    // Routing Method
    async calculateRoute({
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
      mode,
      type,
      units,
      format,
    }) {
      const waypoints = `${fromLongitude},${fromLatitude}|${toLongitude},${toLatitude}`;
      const params = {
        waypoints,
      };
      if (mode) params.mode = mode;
      if (type) params.type = type;
      if (units) params.units = units;
      if (format) params.format = format;
      return this._makeRequest({
        path: "/v1/routing",
        params,
      });
    },
    // IP Geolocation Method
    async geolocateIP({ ipAddress }) {
      return this._makeRequest({
        path: "/v1/ipinfo",
        params: {
          ip: ipAddress,
        },
      });
    },
  },
};
