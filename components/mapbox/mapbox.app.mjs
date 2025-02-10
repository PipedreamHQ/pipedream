import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mapbox",
  propDefinitions: {
    transportationMode: {
      type: "string",
      label: "Transportation Mode",
      description: "The mode of transportation",
      options: constants.TRANSPORTATION_MODES,
    },
    exclude: {
      type: "string[]",
      label: "Exclude",
      description: "Exclude certain road types and custom locations from routing",
      options: constants.EXCLUDE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mapbox.com";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          access_token: this.$auth.access_token,
          ...params,
        },
        ...otherOpts,
      });
    },
    geocode(opts = {}) {
      return this._makeRequest({
        path: "/search/geocode/v6/forward",
        ...opts,
      });
    },
    getDirections({
      transportationMode, coordinates, ...opts
    }) {
      return this._makeRequest({
        path: `/directions/v5/mapbox/${transportationMode}/${coordinates}`,
        ...opts,
      });
    },
    createTilesetSource({
      username, id, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tilesets/v1/sources/${username}/${id}`,
        ...opts,
      });
    },
    validateRecipe(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/tilesets/v1/validateRecipe",
        ...opts,
      });
    },
    createTileset({
      tilesetId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tilesets/v1/${tilesetId}`,
        ...opts,
      });
    },
  },
};
