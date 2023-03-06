import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-create-entity-or-update",
  name: "Create or Update Entity",
  description: "Creates a new entity or updates if it exists. [See the docs here](https://api.fibery.io/graphql.html#update)",
  version: "0.0.1",
  type: "action",
  props: {
    fibery,
    type: {
      propDefinition: [
        fibery,
        "type",
      ],
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
    attributes: {
      propDefinition: [
        fibery,
        "attributes",
      ],
    },
    updateAll: {
      type: "boolean",
      label: "Update All",
      description: "If `true`, all entities that match the filter will be updated. If `false`, only the first entity will be updated",
      optional: true,
    },
  },
  methods: {
    parseProps() {
      return {
        fields: typeof (this.fields) === "string"
          ? JSON.parse(this.fields)
          : this.fields,
        where: typeof (this.where) === "string"
          ? JSON.parse(this.where)
          : this.where,
        params: typeof (this.params) === "string"
          ? JSON.parse(this.params)
          : this.params,
      };
    },
    async findEntity($) {
      const {
        fields,
        where,
        params,
      } = this.parseProps();
      const { result: entities } = await this.fibery.listEntities({
        $,
        type: this.type,
        where,
        fields,
        params,
      });
      return entities;
    },
    async createEntity($) {
      const response = await this.fibery.createEntity({
        $,
        type: this.type,
        attributes: this.attributes,
      });
      $.export("$summary", "Succesfully created a new entity");
      return response;
    },
    async updateEntities($, ids) {
      const response = await this.fibery.updateEntities({
        $,
        type: this.type,
        ids,
        attributes: this.attributes,
      });
      $.export("$summary", `Succesfully updated ${this.fibery.singularOrPluralEntity(ids)}`);
      return response;
    },
  },
  async run({ $ }) {
    const entities = await this.findEntity($);
    let ids = entities.map((entity) => entity["fibery/id"]);

    if (ids.length === 0) {
      return this.createEntity($);
    }

    if (!this.updateAll) {
      ids = ids.slice(0, 1);
    }

    return this.updateEntities($, ids);
  },
};
