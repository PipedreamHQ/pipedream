import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fibery",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.account_name}.fibery.io/api`;
    },
    _auth() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, data, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl(),
        method: "post",
        headers: {
          ...opts.headers,
          "Authorization": `Token ${this._auth()}`,
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async makeCommand({
      command, args = {}, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        data: [
          {
            command,
            args,
          },
        ],
      });
      return response;
    },
    async makeBatchCommands({
      commands, args, ...opts
    }) {
      const data = [];
      for (let i = 0; i < commands.length; i++) {
        data.push({
          command: commands[i],
          args: args[i] ?? {},
        });
      }
      const response = await this._makeRequest({
        ...opts,
        data,
      });
      return response;
    },
  },
};
