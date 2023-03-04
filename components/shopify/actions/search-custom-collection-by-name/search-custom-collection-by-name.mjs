import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-custom-collection-by-name",
  name: "Search Custom Collection by Name",
  description: "Search for a custom collection by name/title. [See the docs](https://shopify.dev/docs/api/admin-rest/2023-01/resources/customcollection#get-custom-collections)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: "The name of the custom collection",
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The custom collection title search should be an exact match",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      title,
      exactMatch,
    } = this;

    const params = {};
    if (exactMatch) {
      params.title = title;
    }

    let collections = await this.shopify.getObjects("customCollection", params);

    if (!exactMatch) {
      collections = collections.filter((collection) =>
        collection.title.toLowerCase().includes(title.toLowerCase()));
    }

    $.export("$summary", `Found ${collections.length} collection(s) matching search criteria.`);
    return collections;
  },
};
