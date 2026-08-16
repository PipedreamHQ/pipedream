import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "csv2geo",
  propDefinitions: {
    address: {
      type: "string",
      label: "Address",
      description: "Full address to geocode (e.g., 1600 Pennsylvania Ave, Washington DC)",
    },
    country: {
      type: "string",
      label: "Country Code",
      description: "2-letter ISO country code (e.g., US, GB, DE, FR). Improves accuracy.",
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Latitude coordinate (e.g., 40.7484). Range: -90 to 90.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Longitude coordinate (e.g., -73.9857). Range: -180 to 180.",
    },
  },
  methods: {
    getBaseUrl() {
      return "https://csv2geo.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($ ?? this, {
        url: `${this.getBaseUrl()}${path}`,
        params: {
          api_key: this.$auth.api_key,
          ...params,
        },
        ...otherOpts,
      });
    },
    async geocode(args = {}) {
      return this._makeRequest({
        path: "/geocode",
        ...args,
      });
    },
    async reverseGeocode(args = {}) {
      return this._makeRequest({
        path: "/reverse",
        ...args,
      });
    },
    async searchPlaces(args = {}) {
      return this._makeRequest({
        path: "/places",
        ...args,
      });
    },
    async autocomplete(args = {}) {
      return this._makeRequest({
        path: "/autocomplete",
        ...args,
      });
    },
  },
};
