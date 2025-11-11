import app from "../../bluecart_api.app.mjs";

export default {
  key: "bluecart_api-get-product",
  name: "Get product",
  description: "Get product data from Walmart. [See the documentation](https://docs.trajectdata.com/bluecartapi/walmart-product-data-api/parameters/product)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    walmartDomain: {
      propDefinition: [
        app,
        "walmartDomain",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    itemId: {
      propDefinition: [
        app,
        "itemId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.searchItem({
      $,
      params: {
        walmart_domain: this.walmartDomain,
        type: "product",
        item_id: this.itemId,
        url: this.url,
      },
    });

    $.export("$summary", "Successfully retrieved data for the product with id: " + response.product.item_id);
    return response;
  },
};
