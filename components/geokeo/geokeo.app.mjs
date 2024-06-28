import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "geokeo",
  propDefinitions: {
    q: {
      type: "string",
      label: "Query",
      description: "The query can have up to 50 characters",
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "This is the latitude of the place you want to reverse geocode, i.e. `40.74842`",
    },
    lng: {
      type: "string",
      label: "Longitude",
      description: "This is the longitude of the place you want to reverse geocode, i.e. `-73.9856`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://geokeo.com/geocode/v1";
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
          api: `${this.$auth.api_key}`,
        },
      });
    },
    async forwardGeocoding(args = {}) {
      return this._makeRequest({
        path: "/search.php",
        ...args,
      });
    },
    async reverseGeocoding(args = {}) {
      return this._makeRequest({
        path: "/reverse.php",
        ...args,
      });
    },
  },
};
