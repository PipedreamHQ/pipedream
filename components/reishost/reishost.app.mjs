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
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://pterodactyl.file.properties/api/client";
    },
    async sendCommand({ command }) {
      return this._makeRequest({
        method: "POST",
        path: "/servers/1a7ce997/command",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data: {
          command,
        },
      });
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, data, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        ...otherOpts,
      });
    },
  },
};
