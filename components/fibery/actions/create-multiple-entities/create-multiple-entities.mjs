import fibery from "../../fibery.app.mjs";
import { createBatchMutation } from "../../common/queries.mjs";

export default {
  key: "fibery-create-multiple-entities",
  name: "Create Multiple Entities",
  description: "Creates entities in batch. [See the docs here](https://api.fibery.io/graphql.html#create)",
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
    attributesList: {
      type: "string",
      label: "List of Attributes",
      description: "A list of entity attributes to create. Must be JSON-serializable, e.g. `[ { \"name\": \"pipedream\" }, { \"name\": \"fibery\" } ]`",
    },
  },
  async run({ $ }) {
    const attributesList = JSON.parse(this.attributesList);
    const query = createBatchMutation(this.entityType, attributesList);
    const response = await this.fibery.makeGraphQLRequest({
      $,
      space: this.space,
      query,
    });
    const suffix = attributesList.length === 1
      ? "y"
      : "ies";
    $.export("$summary", `Succesfully created entit${suffix}`);
    return response;
  },
};
