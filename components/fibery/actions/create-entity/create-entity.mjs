import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-create-entity",
  name: "Create Entity",
  description: "Creates a new entity. [See the docs here](https://api.fibery.io/graphql.html#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    attributes: {
      propDefinition: [
        fibery,
        "attributes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fibery.createEntity({
      $,
      type: this.type,
      attributes: this.attributes,
    });
    $.export("$summary", "Succesfully created a new entity");
    return response;
  },
};
