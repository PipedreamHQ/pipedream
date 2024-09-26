import { axios } from "@pipedream/platform";
import {
  MAX_LIMIT,
  HISTORICAL_LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "fibery",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "A custom type in your Fibery account",
      async options() {
        const types = await this.listTypes();
        return types.map((t) => (t["fibery/name"]));
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `The select fields for an entity type. This prop is an array of strings.
      Each string should have the same structure as [in the docs](https://api.fibery.io/#select-fields)
      E.g. \`["fibery/id",{"Development/Team":["fibery/id"]}]\``,
      async options({ type }) {
        const fields = await this.listFieldsForType({
          type,
        });
        return fields.map((field) => field["fibery/name"]);
      },
    },
    where: {
      type: "string",
      label: "Where",
      description: `A list of expressions to filter the results. [See docs here](https://api.fibery.io/#filter-entities).
      E.g. \`[ "=", [ "Development/name" ], "$pipedream" ]\``,
    },
    params: {
      type: "object",
      label: "Params",
      description: "The params to pass with the `where` query. E.g. `{ \"$pipedream\": \"pipedream\" }`",
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: `The attributes of the entity to create.
      This prop is a JSON object, where each key is the name of the attribute, and each value is the value to set for the field.
      You can use the **List Fields for Entity Type** action to get the list of available fields`,
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
    _createEntityCommand({
      type, id, attributes,
    }) {
      const command = id
        ? "fibery.entity/update"
        : "fibery.entity/create";
      return {
        command,
        args: {
          type,
          entity: {
            ...attributes,
            "fibery/id": id,
          },
        },
      };
    },
    _isCustomType(type) {
      const firstLetterIsUpperCase = (string) => string[0] === string[0].toUpperCase();
      return firstLetterIsUpperCase(type["fibery/name"]);
    },
    singularOrPluralEntity(array) {
      return array.length === 1
        ? "entity"
        : "entities";
    },
    async getFieldName(type) {
      const fields = await this.listFieldsForType({
        type,
      });
      const field = fields.find((field) => field["fibery/name"].toLowerCase().endsWith("/name"));
      return field["fibery/name"];
    },
    async makeCommand({
      command, args = {}, ...opts
    }) {
      const [
        response,
      ] = await this._makeRequest({
        ...opts,
        path: "/commands",
        data: [
          {
            command,
            args,
          },
        ],
      });

      if (response.success === false) {
        throw new Error(JSON.stringify(response.result, null, 2));
      }

      return response;
    },
    async makeBatchCommands(commands) {
      const response = await this._makeRequest({
        path: "/commands",
        data: commands,
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
    async listTypes(opts = {}) {
      const response = await this.makeCommand({
        command: "fibery.schema/query",
        ...opts,
      });
      return response["result"]["fibery/types"]
        .filter((type) => this._isCustomType(type));
    },
    async listFieldsForType({
      type, ...opts
    }) {
      const response = await this.makeCommand({
        command: "fibery.schema/query",
        ...opts,
      });
      return response["result"]["fibery/types"]
        .find((t) => t["fibery/name"] === type)["fibery/fields"];
    },
    async listEntities({
      type, fields = [], where, params, orderBy, limit = MAX_LIMIT, ...opts
    }) {
      return this.makeCommand({
        ...opts,
        command: "fibery.entity/query",
        args: {
          query: {
            "q/from": type,
            "q/select": [
              "fibery/id",
              "fibery/creation-date",
              await this.getFieldName(type),
              ...fields,
            ],
            "q/order-by": orderBy,
            "q/where": where,
            "q/limit": limit,
          },
          params,
        },
      });
    },
    async listHistoricalEntities({ type }) {
      const orderBy = [
        [
          [
            "fibery/creation-date",
          ],
          "q/desc",
        ],
      ];
      return this.listEntities({
        type,
        orderBy,
        limit: HISTORICAL_LIMIT,
      });
    },
    async createEntity({
      type, attributes,
    }) {
      const config = this._createEntityCommand({
        type,
        attributes,
      });
      return this.makeCommand(config);
    },
    async updateEntity({
      type, id, attributes,
    }) {
      const config = this._createEntityCommand({
        type,
        attributes,
        id,
      });
      return this.makeCommand(config);
    },
    async createEntities({
      type, attributesList,
    }) {
      const configs = [];
      for (const attributes of attributesList) {
        const config = this._createEntityCommand({
          type,
          attributes,
        });
        configs.push(config);
      }
      return this.makeBatchCommands(configs);
    },
    async updateEntities({
      type, ids, attributes,
    }) {
      const configs = [];
      for (const id of ids) {
        const config = this._createEntityCommand({
          type,
          id,
          attributes,
        });
        configs.push(config);
      }
      return this.makeBatchCommands(configs);
    },
  },
};
