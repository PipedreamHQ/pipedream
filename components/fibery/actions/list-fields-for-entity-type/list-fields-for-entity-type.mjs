import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-fields-for-entity-type",
  name: "List Fields for Entity Type",
  description: "Lists fields for an entity type. [See the docs here](https://api.fibery.io/graphql.html#list-of-entities)",
  version: "0.0.1",
  type: "action",
  props: {
    fibery,
    space: {
      propDefinition: [
        fibery,
        "space",
      ],
    },
    entityType: {
      propDefinition: [
        fibery,
        "entityType",
        (c) => ({
          space: c.space,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fibery.listFields({
      $,
      space: this.space,
      entityType: this.entityType,
    });
    $.export("$summary", `Successfully listed ${response.length} field(s) for ${this.entityType}`);
    return response;
  },
};
