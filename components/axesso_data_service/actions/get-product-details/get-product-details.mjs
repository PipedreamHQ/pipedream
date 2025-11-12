import axesso from "../../axesso_data_service.app.mjs";

export default {
  key: "axesso_data_service-get-product-details",
  name: "Get Product Details",
  description: "Requests product detail information using Axesso Data Service. [See the documentation](https://axesso.developer.azure-api.net/api-details#api=axesso-amazon-data-service&operation=product-details)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    axesso,
    url: {
      propDefinition: [
        axesso,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.axesso.getProductDetails({
      $,
      params: {
        url: this.url,
        psc: 1,
      },
    });
    $.export("$summary", `Retrieved product details for URL: ${this.url}`);
    return response;
  },
};
