import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-create-multiple-entities",
  name: "Create Multiple Entities",
  description: "Creates entities in batch. [See the docs here](https://api.fibery.io/graphql.html#create)",
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
    attributesList: {
      type: "string",
      label: "List of Attributes",
      description: "A list of entity attributes to create. Must be JSON-serializable, e.g. `[ { \"Development/name\": \"pipedream\" }, { \"Development/name\": \"fibery\" } ]`",
    },
  },
  async run({ $ }) {
    const type = this.type;
    const attributesList = JSON.parse(this.attributesList);
    const response = await this.fibery.createEntities({
      type,
      attributesList,
    });
    $.export("$summary", `Succesfully created ${this.fibery.singularOrPluralEntity(attributesList)}`);
    return response;
  },
};
