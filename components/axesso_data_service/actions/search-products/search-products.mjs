import axesso from "../../axesso_data_service.app.mjs";

export default {
  key: "axesso_data_service-search-products",
  name: "Search Products",
  description: "Search Amazon products by keyword using Axesso Data Service. [See the documentation](https://axesso.developer.azure-api.net/api-details#api=axesso-amazon-data-service&operation=search-products)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    axesso,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for products",
    },
    domainCode: {
      propDefinition: [
        axesso,
        "domainCode",
      ],
    },
    sortBy: {
      propDefinition: [
        axesso,
        "sortBy",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "Valid category list can found on the amazon website on the search selection box. Important: If the passed category is not a valid amazon category, the response will be empty",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        axesso,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.axesso.paginate({
      fn: this.axesso.searchProducts,
      args: {
        $,
        params: {
          keyword: this.keyword,
          domainCode: this.domainCode,
          sortBy: this.sortBy,
          category: this.category,
        },
      },
      resourceKey: "searchProductDetails",
      max: this.maxResults,
    });

    const products = [];
    for await (const product of results) {
      products.push(product);
    }

    $.export("$summary", `Found ${products.length} product${products.length === 1
      ? ""
      : "s"} for keyword '${this.keyword}'`);
    return products;
  },
};
