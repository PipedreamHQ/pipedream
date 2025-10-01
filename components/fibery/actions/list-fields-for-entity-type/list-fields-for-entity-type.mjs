import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-fields-for-entity-type",
  name: "List Fields for Entity Type",
  description: "Lists fields for an entity type. [See the docs here](https://api.fibery.io/graphql.html#list-of-entities)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fibery,
    type: {
      propDefinition: [
        fibery,
        "type",
      ],
    },
  },
  async run({ $ }) {
    const type = this.type;
    const response = await this.fibery.listFieldsForType({
      $,
      type,
    });
    $.export("$summary", `Successfully listed ${response.length} field(s) for ${type}`);
    return response;
  },
};
