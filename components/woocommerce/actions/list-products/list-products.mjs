import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-list-products",
  name: "List Products",
  description: "Retrieve a list of products. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-products)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
    productStatus: {
      propDefinition: [
        app,
        "productStatus",
      ],
    },
    productType: {
      propDefinition: [
        app,
        "productType",
      ],
    },
    after: {
      type: "string",
      label: "After",
      description: "Limit response to resources published after a given ISO8601 compliant date (e.g., `2023-01-01T00:00:00`)",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Limit response to resources published before a given ISO8601 compliant date (e.g., `2023-12-31T23:59:59`)",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      maxResults,
      search,
      productStatus,
      productType,
      after,
      before,
    } = this;

    const params = {
      page: 1,
      per_page: 10,
      ...Object.fromEntries(
        Object.entries({
          search,
          status: productStatus,
          type: productType,
          after,
          before,
        }).filter(([
          ,
          v,
        ]) => v),
      ),
    };

    const products = [];
    let results;
    do {
      results = await this.app.listProducts(params);
      products.push(...results);
      params.page += 1;
    } while (results.length === params.per_page && products.length < maxResults);

    if (products.length > maxResults) {
      products.length = maxResults;
    }

    $.export("$summary", `Successfully retrieved ${products.length} product(s)`);

    return products;
  },
};
