import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-get-store-products",
  name: "Get Store Products",
  description: "Get all products for a store with optional filters. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Store-management/operation/getStoreProducts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    stadium,
    storeNumber: {
      propDefinition: [
        stadium,
        "storeNumber",
      ],
    },
    page: {
      propDefinition: [
        stadium,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        stadium,
        "perPage",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort order for products (e.g., `price:asc`)",
      optional: true,
    },
    countryCode: {
      propDefinition: [
        stadium,
        "countryCode",
      ],
    },
    color: {
      type: "string",
      label: "Color",
      description: "Filter products by color",
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "Filter products by size",
      optional: true,
    },
    includeInactiveProducts: {
      type: "boolean",
      label: "Include Inactive Products",
      description: "Include inactive products in the results",
      optional: true,
    },
    withOutOfStock: {
      type: "boolean",
      label: "Include Out of Stock",
      description: "Include out of stock products in the results",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.stadium.getStoreProducts({
      $,
      storeNumber: this.storeNumber,
      page: this.page,
      perPage: this.perPage,
      sortBy: this.sortBy,
      countryCode: this.countryCode,
      color: this.color,
      size: this.size,
      includeInactiveProducts: this.includeInactiveProducts,
      withOutOfStock: this.withOutOfStock,
    });
    const count = response.products?.length ?? 0;
    const total = response.meta?.total ?? count;
    $.export("$summary", `Successfully retrieved ${count} product${count === 1
      ? ""
      : "s"} (${total} total)`);
    return response;
  },
};
