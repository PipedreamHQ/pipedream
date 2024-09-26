import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "big_data_cloud",
  propDefinitions: {
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Latitude value as per WGS 84 reference system (GPS system). Expected values are in [-90, 90] range",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Longitude value as per WGS 84 reference system (GPS system). Expected values are in [-180, 180] range",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-bdc.net/data";
    },
    _authParams(params = {}) {
      return {
        ...params,
        key: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    reverseGeocode(args = {}) {
      return this._makeRequest({
        path: "/reverse-geocode",
        ...args,
      });
    },
    performIpGeolocation(args = {}) {
      return this._makeRequest({
        path: "/ip-geolocation",
        ...args,
      });
    },
    timeZoneByLocation(args = {}) {
      return this._makeRequest({
        path: "/timezone-by-location",
        ...args,
      });
    },
  },
};
