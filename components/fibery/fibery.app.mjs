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
        return types.map((t) => (this._getTypeName(t)));
      },
    },
    field: {
      type: "string",
      label: "Field",
      description: "The field in an entity type",
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
    _isCustomType(type) {
      const firstLetterIsUpperCase = (string) => string[0] === string[0].toUpperCase();
      return firstLetterIsUpperCase(this._getTypeName(type));
    },
    _getTypeName(type) {
      return type["fibery/name"];
    },
    singularOrPluralEntity(array) {
      return array.length === 1
        ? "entity"
        : "entities";
    },
    getFieldName(type) {
      const database = type.split("/")[0];
      return `${database}/name`;
    },
    async makeGraphQLRequest({
      $, space, query, ...opts
    }) {
      $?.export("query", query);
      const response = await this._makeRequest({
        ...opts,
        $,
        path: `/graphql/space/${space}`,
        method: "post",
        data: {
          query,
        },
      });

      if (response.errors?.length) {
        throw new Error(JSON.stringify(response.errors));
      }

      return response;
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
        .find((fiberyType) => fiberyType["fibery/name"] === type)["fibery/fields"];
    },
    async listHistoricalEntities({
      type, ...opts
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
              this.getFieldName(type),
            ],
            "q/order-by": [
              [
                [
                  "fibery/creation-date",
                ],
                "q/desc",
              ],
            ],
            "q/limit": HISTORICAL_LIMIT,
          },
        },
      });
    },
    async listEntitiesCommand({
      type, fields = [], where, params, ...opts
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
              this.getFieldName(type),
              ...fields,
            ],
            "q/where": where,
            "q/limit": MAX_LIMIT,
          },
          params,
        },
      });
    },
    async createEntity({
      type, attributes, ...opts
    }) {
      return this.makeCommand({
        ...opts,
        command: "fibery.entity/create",
        args: {
          type,
          entity: attributes,
        },
      });
    },
    async createEntities({
      type, attributesList,
    }) {
      const commands = attributesList.map((attributes) => ({
        command: "fibery.entity/create",
        args: {
          type,
          entity: attributes,
        },
      }));
      return this.makeBatchCommands(commands);
    },
    async updateEntity({
      type, id, attributes, ...opts
    }) {
      return this.makeCommand({
        ...opts,
        command: "fibery.entity/update",
        args: {
          type,
          entity: {
            "fibery/id": id,
            ...attributes,
          },
        },
      });
    },
    async updateEntities({
      type, ids, attributes,
    }) {
      const commands = ids.map((id) => ({
        command: "fibery.entity/update",
        args: {
          type,
          entity: {
            "fibery/id": id,
            ...attributes,
          },
        },
      }));
      return this.makeBatchCommands(commands);
    },
  },
};
