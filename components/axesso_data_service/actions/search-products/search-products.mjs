import axesso_data_service from "../../axesso_data_service.app.mjs";

export default {
  key: "axesso_data_service-search-products",
  name: "Search Products",
  description: "Search products by keyword. [See the documentation](https://axesso.developer.azure-api.net/api-details)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    axesso_data_service: {
      type: "app",
      app: "axesso_data_service",
    },
    domainCode: {
      propDefinition: [
        axesso_data_service,
        "domainCode",
      ],
    },
    keyword: {
      propDefinition: [
        axesso_data_service,
        "keyword",
      ],
    },
    sortBy: {
      propDefinition: [
        axesso_data_service,
        "sortBy",
      ],
      optional: true,
    },
    category: {
      propDefinition: [
        axesso_data_service,
        "category",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        axesso_data_service,
        "maxResults",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.axesso_data_service.searchProducts();
    $.export("$summary", `Found ${response.products.length} products for keyword '${this.keyword}'`);
    return response;
  },
};
