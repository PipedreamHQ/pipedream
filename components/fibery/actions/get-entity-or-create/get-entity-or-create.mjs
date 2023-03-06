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
      withLabel: true,
    },
    fields: {
      propDefinition: [
        fibery,
        "field",
        (c) => ({
          type: c.type.label,
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
  async run({ $ }) {
    const fields = typeof (this.fields) === "string"
      ? JSON.parse(this.fields)
      : this.fields;

    const where = typeof (this.where) === "string"
      ? JSON.parse(this.where)
      : this.where;

    const params = typeof (this.params) === "string"
      ? JSON.parse(this.params)
      : this.params;

    const { result: entities } = await this.fibery.listEntitiesCommand({
      $,
      type: this.type.label,
      where,
      fields,
      params,
    });

    if (entities.length > 0) {
      $.export("$summary", `Found ${entities.length} existing ${this.fibery.singularOrPluralEntity(entities)}`);
      return entities;
    }

    const response = await this.fibery.createEntity({
      $,
      type: this.type.label,
      attributes: this.attributes,
    });
    $.export("$summary", "Succesfully created a new entity");
    return response;
  },
};
