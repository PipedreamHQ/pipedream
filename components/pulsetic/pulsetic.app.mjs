import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pulsetic",
  propDefinitions: {
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The ID of the monitor to retrieve events for",
      async options() {
        const data = await this.listMonitors();

        return data.map(({
          id: value, name, url,
        }) => ({
          label: name || url,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pulsetic.com/api/public";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.oauth_access_token}`,
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
    listEvents({
      monitorId, ...opts
    }) {
      return this._makeRequest({
        path: `/${monitorId}/events`,
        ...opts,
      });
    },
    listMonitors(opts = {}) {
      return this._makeRequest({
        path: "/monitors",
        ...opts,
      });
    },
  },
};
