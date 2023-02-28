import fibery from "../../fibery.app.mjs";
import {
  createMutation,
  updateMutation,
  findQuery,
} from "../../common/queries.mjs";

export default {
  key: "fibery-create-entity-or-update",
  name: "Create or Update Entity",
  description: "Creates a new entity or updates if it exists. [See the docs here](https://api.fibery.io/graphql.html#update)",
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
    updateAll: {
      type: "boolean",
      label: "Update All",
      description: "If `true`, all entities that match the filter will be updated. If `false`, only the first entity will be updated",
      optional: true,
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

    if (searchResults.length === 0) {
      const response = await this.fibery.makeGraphQLRequest({
        $,
        space: this.space,
        query: createMutation(this.entityType, this.attributes),
      });
      $.export("$summary", "Succesfully created a new entity");
      return response;
    }

    let ids = searchResults.map((entity) => entity.id);

    if (!this.updateAll) {
      ids = ids.slice(0, 1);
    }

    const response = await this.fibery.makeGraphQLRequest({
      $,
      space: this.space,
      query: updateMutation(this.entityType, this.attributes, ids),
    });
    $.export("$summary", `Succesfully updated ${this.fibery.singularOrPluralEntity(ids)}`);
    return response;
  },
};
