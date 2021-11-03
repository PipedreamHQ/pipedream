/* eslint-disable camelcase */
import axios from "axios";
import sortBy from "lodash/sortBy.js";

export default {
  type: "app",
  app: "zoom_admin",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "LocationId",
      description: "Location ID of the lowest level location in the (location hierarchy)[https://support.zoom.us/hc/en-us/articles/115000342983-Zoom-Rooms-Location-Hierarchy] where the Zoom Room is to be added. For instance if the structure of the location hierarchy is set up as “country, states, city, campus, building, floor”, a room can only be added under the floor level location.",
      optional: true,
    },
    webinars: {
      type: "string[]",
      label: "Webinars",
      optional: true,
      description:
        "Webinars you want to watch for new events. **Leave blank to watch all webinars**.",
      async options({ nextPageToken }) {
        const {
          webinars,
          next_page_token,
        } = await this.listWebinars({
          nextPageToken,
        });
        if (!webinars.length) {
          return [];
        }
        const rawOptions = webinars.map((w) => ({
          label: w.topic,
          value: w.id,
        }));
        const options = sortBy(rawOptions, [
          "label",
        ]);

        return {
          options,
          context: {
            nextPageToken: next_page_token,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.zoom.us/v2";
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "user-agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._apiUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Accept"] = "application/json";
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Authorization"] = `Bearer ${this.$auth.oauth_access_token}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      // eslint-disable-next-line multiline-ternary
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return await axios(opts);
    },
    async listWebinars({
      pageSize,
      nextPageToken,
    }) {
      const { data } = await this._makeRequest({
        path: "/users/me/webinars",
        params: {
          page_size: pageSize || 300,
          next_page_token: nextPageToken,
        },
      });
      return data;
    },
    async listWebinarPanelists(webinarID) {
      const { data } = await this._makeRequest({
        path: `/webinars/${webinarID}/panelists`,
      });
      return data;
    },
  },
};
