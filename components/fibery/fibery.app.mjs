import { axios } from "@pipedream/platform";
import {
  QUERY_ALL,
  MUTATION_ALL,
  findQuery,
} from "./common/queries.mjs";
import {
  MAX_LIMIT,
  HISTORICAL_LIMIT,
} from "./common/constants.mjs";

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
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "A custom entity type in your Fibery account",
      async options({ space }) {
        return this.listMutations({
          space,
        });
      },
    },
    listingType: {
      type: "string",
      label: "Listing Type",
      description: "A custom listing type to query in your Fibery account",
      async options({ space }) {
        return this.listQueries({
          space,
        });
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
      const response = await this.makeCommand({
        command: "fibery.schema/query",
        ...opts,
      });

      return response["result"]["fibery/types"]
        .filter((type) => this._isCustomType(type))
        .filter((type) => this._isTypeInSpace(type, space));
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
      type, fieldName, ...opts
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
              fieldName,
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
      type, where, fields, params, ...opts
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
    async listEntities({
      space, listingType, filter, fields, ...opts
    }) {
      let offset = 0;
      const data = [];

      while (true) {
        const response = await this.makeGraphQLRequest({
          ...opts,
          space,
          query: findQuery(listingType, filter, fields, offset),
        });

        const results = response.data[listingType];
        data.push(...results);
        offset += MAX_LIMIT;

        if (results.length < MAX_LIMIT) {
          return data;
        }
      }
    },
    async listMutations({
      space, ...opts
    }) {
      const { data } = await this.makeGraphQLRequest({
        ...opts,
        space,
        query: MUTATION_ALL,
      });
      return data.__type.fields
        .map((field) => field.name);
    },
    async listQueries({
      space, ...opts
    }) {
      const { data } = await this.makeGraphQLRequest({
        ...opts,
        space,
        query: QUERY_ALL,
      });
      return data.__type.fields
        .filter(({ name }) => name !== "me")
        .map((field) => field.name);
    },
  },
};
