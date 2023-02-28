import fibery from "../../fibery.app.mjs";
import {
  createMutation,
  updateMutation,
  filterQuery,
} from "../../common/queries.mjs";

export default {
  key: "fibery-create-entity-or-update",
  name: "Create Entity or Update",
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
      type: "object",
      label: "Filter",
      description: "The filter expression(s) that will be applied in the query. E.g. `name: { is: \"Pipedream\"}`. [More info here](https://api.fibery.io/graphql.html#filtering)",
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "The attributes of the entity to create if it doesn't exist",
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
      query: filterQuery(this.listingType, this.filter),
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

    const suffix = ids.length === 1
      ? "y"
      : "ies";
    $.export("$summary", `Succesfully updated entit${suffix}`);
    return response;
  },
};
