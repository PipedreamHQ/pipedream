import fibery from "../../fibery.app.mjs";
import { createMutation } from "../../common/queries.mjs";

export default {
  key: "fibery-create-entity",
  name: "Create Entity",
  description: "Creates a new entity. [See the docs here](https://api.fibery.io/graphql.html#create)",
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
    attributes: {
      type: "object",
      label: "Attributes",
      description: "The attributes of the entity to create",
    },
  },
  async run({ $ }) {
    const query = createMutation(this.entityType, this.attributes);
    const response = await this.fibery.makeGraphQLRequest({
      $,
      space: this.space,
      query,
    });
    $.export("$summary", "Succesfully created a new entity");
    return response;
  },
};
