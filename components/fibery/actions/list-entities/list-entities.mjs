import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-entities",
  name: "List Entities",
  description: "Lists entities for a type. [See the docs here](https://api.fibery.io/graphql.html#list-of-entities)",
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
    $.export("$summary", `Successfully listed ${entities.length} ${this.fibery.singularOrPluralEntity(entities)}`);
    return entities;
  },
};
