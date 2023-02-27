import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fibery",
  propDefinitions: {
    space: {
      type: "string",
      label: "Space",
      description: "The space to watch for changes",
      async options() {
        return this.listSpaces();
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "A custom type in your Fibery account",
      async options({ space }) {
        const types = await this.listTypes({
          space,
        });
        return types.map((t) => ({
          label: this._getTypeName(t),
          value: t["fibery/id"],
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.account_name}.fibery.io/api`;
    },
    _auth() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, path, method = "post", ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        method,
        headers: {
          ...opts.headers,
          "Authorization": `Token ${this._auth()}`,
          "Content-Type": "application/json",
        },
      });
    },
    _extractSpacesFromResponse(response) {
      return response
        .split("\n")
        .filter((r) => r.match("/space/"))
        .map((r) => r.split("/space/")[1])
        .map((r) => r.split("'>")[0]);
    },
    _isTypeInSpace(type, space) {
      if (!space) {
        return true;
      }
      return this._getTypeName(type).startsWith(`${space}/`);
    },
    _isCustomType(type) {
      const firstLetterIsUpperCase = (string) => string[0] === string[0].toUpperCase();
      return firstLetterIsUpperCase(this._getTypeName(type));
    },
    _getTypeName(type) {
      return type["fibery/name"];
    },
    async makeCommand({
      command, args = {}, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: "/commands",
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
        path: "/commands",
        data,
      });
      return response;
    },
    async createWebhook(opts) {
      const response = await this._makeRequest({
        path: "/webhooks/v2",
        ...opts,
      });
      return response;
    },
    async deleteWebhook({ webhookId }) {
      await this._makeRequest({
        path: `/webhooks/v2/${webhookId}`,
        method: "delete",
      });
    },
    async listSpaces(opts = {}) {
      const response = await this._makeRequest({
        ...opts,
        path: "/graphql",
        method: "get",
      });
      // have to extract from html response...
      // there is no endpoint for listing spaces
      return this._extractSpacesFromResponse(response);
    },
    async listTypes({
      space, ...opts
    } = {}) {
      const [
        response,
      ] = await this.makeCommand({
        command: "fibery.schema/query",
        ...opts,
      });

      return response["result"]["fibery/types"]
        .filter((type) => this._isCustomType(type))
        .filter((type) => this._isTypeInSpace(type, space));
    },
  },
};
