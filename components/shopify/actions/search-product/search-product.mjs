import shopify from "../../shopify.app.js";

export default {
  key: "shopify-search-product",
  name: "Search Product",
  description: "Search for products",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    id: {
      propDefinition: [
        shopify,
        "productId",
        (c) => c,
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `A comma-separated list of fields to include in the response
        Check out [Shopify Product API](https://shopify.dev/api/admin-rest/2022-01/resources/product#resource_object) for options`,
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      fields: this.fields,
    };

    let response = await this.shopify.getProduct(this.id, params);
    let title = response.title
      ? ` \`${response.title}\``
      : "";
    let id = response.id
      ? ` with id \`${response.id}\``
      : "";

    $.export("$summary", `Found product${title}${id}`);
    return response;
  },
};
