import { axios } from "@pipedream/platform";

export default {
  key: "fibery-get-entity-or-create",
  name: "Get or Create Entity",
  description: "Get an entity or create one if it doesn't exist. [See the docs here](https://api.fibery.io/graphql.html#create)",
  version: "0.0.1",
  type: "action",
  props: {
    fibery: {
      type: "app",
      app: "fibery",
    },
    type: {
      type: "string",
      label: "Type",
      description: "A custom type in your Fibery account",
      async options() {
        const types = await this.listTypes();
        return types.map((t) => (t["fibery/name"]));
      },
    },
    where: {
      type: "string",
      label: "Where",
      description: `A list of expressions to filter the results. [See docs here](https://api.fibery.io/#filter-entities).
        E.g. \`[ "=", [ "Development/name" ], "$pipedream" ]\``,
      optional: true,
    },
    params: {
      type: "object",
      label: "Params",
      description: "The params to pass with the `where` query. E.g. `{ \"$pipedream\": \"pipedream\" }`",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `The select fields for an entity type. This prop is an array of strings.
        Each string should have the same structure as [in the docs](https://api.fibery.io/#select-fields)
        E.g. \`["fibery/id",{"Development/Team":["fibery/id"]}]\``,
      optional: true,
      async options({ type }) {
        const fields = await this.listFieldsForType({
          type,
        });
        return fields.map((field) => field["fibery/name"]);
      },
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
    async listEntities({
      type, fields = [], where, params, orderBy, limit = 50, ...opts
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
    parseProps(fields, where, params) {
      return {
        fields: typeof (fields) === "string"
          ? JSON.parse(fields)
          : fields,
        where: typeof (where) === "string"
          ? JSON.parse(where)
          : where,
        params: typeof (params) === "string"
          ? JSON.parse(params)
          : params,
      };
    },
    async findEntities($) {
      const {
        fields,
        where,
        params,
      } = this.parseProps(this.fields, this.where, this.params);
      const { result: entities } = await this.listEntities({
        $,
        type: this.type,
        where,
        fields,
        params,
      });
      $.export("$summary", `Found ${entities.length} existing ${this.singularOrPluralEntity(entities)}`);
      return entities;
    },
    async createEntity($) {
      const config = this._createEntityCommand({
        $,
        type: this.type,
        attributes: this.attributes,
      });
      const response = await this.makeCommand(config);
      $.export("$summary", "Succesfully created a new entity");
      return response;
    },
    async updateEntities($, ids) {
      const configs = [];
      for (const id of ids) {
        const config = this._createEntityCommand({
          $,
          id,
          type: this.type,
          attributes: this.attributes,
        });
        configs.push(config);
      }
      const response = await this.makeBatchCommands(configs);
      $.export("$summary", `Succesfully updated ${this.singularOrPluralEntity(ids)}`);
      return response;
    },
  },
  async run({ $ }) {
    const entities = await this.findEntities($);
    return entities.length
      ? entities
      : this.createEntity($);
  },
};
