import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-get-entity-or-create",
  name: "Get or Create Entity",
  description: "Get an entity or create one if it doesn't exist. [See the docs here](https://api.fibery.io/graphql.html#create)",
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
    fields: {
      propDefinition: [
        fibery,
        "field",
        (c) => ({
          type: c.type,
        }),
      ],
      type: "string[]",
      label: "Fields",
      description: `The select fields to return in the query. This prop is an array of strings.
      Each string should have the same structure as [in the docs](https://api.fibery.io/#select-fields)
      E.g. \`["fibery/id",{"Development/Team":["fibery/id"]}]\``,
      optional: true,
    },
    where: {
      propDefinition: [
        fibery,
        "where",
      ],
      optional: true,
    },
    params: {
      propDefinition: [
        fibery,
        "params",
      ],
      optional: true,
    },
    attributes: {
      propDefinition: [
        fibery,
        "attributes",
      ],
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
  },
  async run({ $ }) {
    const entities = await this.findEntity($);

    if (entities.length === 0) {
      return this.createEntity($);
    }

    $.export("$summary", `Found ${entities.length} existing ${this.fibery.singularOrPluralEntity(entities)}`);
    return entities;
  },
};
