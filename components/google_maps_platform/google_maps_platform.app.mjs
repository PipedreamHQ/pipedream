import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_maps_platform",
  propDefinitions: {
    simplified: {
      type: "boolean",
      label: "Simplified Response",
      description: "If `true`, the response will contain a reduced set of fields",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://places.googleapis.com/v1/places";
    },
    _headers() {
      return {
        "X-Goog-Api-Key": this.$auth.api_key,
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "*",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    searchPlaces(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: ":searchText",
        ...opts,
      });
    },
    getPlaceDetails({
      placeId, ...opts
    }) {
      return this._makeRequest({
        path: `/${placeId}`,
        ...opts,
      });
    },
  },
};
