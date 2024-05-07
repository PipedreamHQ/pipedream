import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reishost",
  propDefinitions: {
    command: {
      type: "string",
      label: "Command",
      description: "The command you want to execute on the server.",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.endpoint_structure}/api`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    sendCommand({
      serverId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/client/servers/${serverId}/command`,
        ...opts,
      });
    },
  },
};
