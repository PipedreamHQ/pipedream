import common from "../common/common-entities.mjs";

export default {
  ...common,
  key: "fibery-get-entity-or-create",
  name: "Get or Create Entity",
  description: "Get an entity or create one if it doesn't exist. [See the docs here](https://api.fibery.io/graphql.html#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run({ $ }) {
    const entities = await this.findEntities($);
    return entities.length
      ? entities
      : this.createEntity($);
  },
};
