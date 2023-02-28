import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-entities",
  name: "List Entities",
  description: "Lists entities for a type. [See the docs here](https://api.fibery.io/graphql.html#list-of-entities)",
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
    listingType: {
      propDefinition: [
        fibery,
        "listingType",
        (c) => ({
          space: c.space,
        }),
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to return in the query. Defaults to `id` and `name` only",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fibery.listEntities({
      $,
      space: this.space,
      listingType: this.listingType,
      fields: this.fields,
    });
    const suffix = response.length === 1
      ? "y"
      : "ies";
    $.export("$summary", `Successfully listed ${response.length} entit${suffix}`);
    return response;
  },
};
