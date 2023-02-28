import fibery from "../../fibery.app.mjs";
import {
  createMutation,
  findQuery,
} from "../../common/queries.mjs";

export default {
  key: "fibery-get-entity-or-create",
  name: "Get Entity or Create",
  description: "Get an entity or create one if it doesn't exist. [See the docs here](https://api.fibery.io/graphql.html#create)",
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
    listingType: {
      propDefinition: [
        fibery,
        "listingType",
        (c) => ({
          space: c.space,
        }),
      ],
    },
    filter: {
      propDefinition: [
        fibery,
        "filter",
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
    const { data } = await this.fibery.makeGraphQLRequest({
      $,
      space: this.space,
      listingType: this.listingType,
      query: findQuery(this.listingType, this.filter),
    });

    const searchResults = data[this.listingType];

    if (searchResults.length) {
      $.export("$summary", `Found ${searchResults.length} existing ${this.fibery.singularOrPluralEntities(searchResults)}`);
      return searchResults;
    }

    const response = await this.fibery.makeGraphQLRequest({
      $,
      space: this.space,
      query: createMutation(this.entityType, this.attributes),
    });
    $.export("$summary", "Succesfully created a new entity");
    return response;
  },
};
