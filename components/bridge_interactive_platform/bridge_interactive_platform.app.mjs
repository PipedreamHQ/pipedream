import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bridge_interactive_platform",
  propDefinitions: {
    dataset: {
      type: "string",
      label: "Dataset",
      description: "The dataset to use for the query",
    },
    field: {
      type: "string",
      label: "Field",
      description: "Response field to sort query by",
      optional: true,
      async options({ dataset }) {
        const response = await this.getListings({
          dataset,
          params: {
            limit: 1,
          },
        });
        const listing = response.bundle[0];
        return Object.keys(listing);
      },
    },
    near: {
      type: "string",
      label: "Near",
      description: "Coord or location eg. near=-73.98,40.73 or near=San Diego",
      optional: true,
    },
    radius: {
      type: "string",
      label: "Radius",
      description: "Search Radius in miles, km, or degrees (no units)s",
      optional: true,
    },
    box: {
      type: "string",
      label: "Box",
      description: "Coordinates representing a box eg. box=-112.5,33.75,-123,39",
      optional: true,
    },
    poly: {
      type: "string",
      label: "Poly",
      description: "Minimum 3 pairs of coordinates representing a polygon eg. poly=-112.5,33.75,-123,39,-120,38",
      optional: true,
    },
    geohash: {
      type: "string",
      label: "Geohash",
      description: "Alphanumeric geohash eg. geohash=ezs42",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bridgedataoutput.com/api/v2";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          access_token: `${this.$auth.access_token}`,
        },
        ...opts,
      });
    },
    getListings({
      dataset, ...opts
    }) {
      return this._makeRequest({
        path: `/${dataset}/listings`,
        ...opts,
      });
    },
  },
};
