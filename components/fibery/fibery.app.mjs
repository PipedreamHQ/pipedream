import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fibery",
  propDefinitions: {
    entity: {
      type: "string",
      label: "Entity",
      description: "A custom entity in your Fibery account",
      async options() {
        const entities = await this.listEntities();
        return entities.map((entity) => ({
          label: entity["fibery/name"],
          value: entity["fibery/id"],
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
    getEntityName(entity) {
      return entity["fibery/name"];
    },
    isCustomEntity(entity) {
      const firstLetterIsUpperCase = (string) => string[0] === string[0].toUpperCase();
      return firstLetterIsUpperCase(this.getEntityName(entity));
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
    async listEntities(opts = {}) {
      const [
        response,
      ] = await this.makeCommand({
        command: "fibery.schema/query",
        ...opts,
      });

      return response["result"]["fibery/types"].filter(this.isCustomEntity);
    },
  },
};
