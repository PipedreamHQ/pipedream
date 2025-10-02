import shopify from "../../shopify.app.mjs";
import { COLLECTION_SORT_KEY } from "../../common/constants.mjs";

export default {
  key: "shopify-search-custom-collection-by-name",
  name: "Search Custom Collection by Name",
  description: "Search for a custom collection by name/title. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/collections)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    title: {
      type: "string",
      label: "Title",
      description: "The name of the custom collection",
      optional: true,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The collection title search should be an exact match",
      optional: true,
      default: false,
    },
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
      ],
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      options: COLLECTION_SORT_KEY,
    },
    reverse: {
      propDefinition: [
        shopify,
        "reverse",
      ],
    },
  },
  async run({ $ }) {
    let collections = await this.shopify.getPaginated({
      resourceFn: this.shopify.listCollections,
      resourceKeys: [
        "collections",
      ],
      variables: {
        sortKey: this.sortKey,
        reverse: this.reverse,
        query: this.title && this.exactMatch
          ? `title:"${this.title}"`
          : undefined,
      },
    });
    if (this.title && !this.exactMatch) {
      collections = collections.filter((collection) =>
        collection.title.toLowerCase().includes(this.title.toLowerCase()));
    }

    if (collections.length > this.maxResults) {
      collections.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${collections.length} collection${collections.length === 1
      ? ""
      : "s"}`);
    return collections;
  },
};
