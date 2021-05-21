const axios = require("axios");
const sortBy = require("lodash/sortBy");

module.exports = {
  type: "app",
  app: "zoom_admin",
  propDefinitions: {
    webinars: {
      type: "string[]",
      label: "Webinars",
      optional: true,
      description:
        "Webinars you want to watch for new events. **Leave blank to watch all webinars**.",
      async options({ nextPageToken }) {
        const { webinars, next_page_token } = await this.listWebinars({
          nextPageToken,
        });
        if (!webinars.length) {
          return [];
        }
        const rawOptions = webinars.map((w) => ({
          label: w.topic,
          value: w.id,
        }));
        const options = sortBy(rawOptions, ["label"]);

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
      return `https://api.zoom.us/v2`;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Accept"] = "application/json";
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Authorization"] = `Bearer ${this._accessToken()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return await axios(opts);
    },
    async listWebinars({ pageSize, nextPageToken }) {
      const { data } = await this._makeRequest({
        path: `/users/me/webinars`,
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
