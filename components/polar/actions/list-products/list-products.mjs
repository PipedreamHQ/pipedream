import app from "../../polar.app.mjs";

export default {
  key: "polar-list-products",
  name: "List Products",
  description: "List products according to the specified filters. [See the API docs](https://polar.sh/docs/api-reference/products/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
    },
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filter by product name.",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Filter on archived products.",
      optional: true,
    },
    isRecurring: {
      type: "boolean",
      label: "Is Recurring",
      description: "Filter on recurring products. If true, only subscription tiers are returned. If false, only one-time purchase products are returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      organizationId: this.organizationId,
      id: this.productId,
      query: this.query,
      isArchived: this.isArchived,
      isRecurring: this.isRecurring,
    };
    const productList = await this.app.listProducts(params);
    $.export("$summary", `Successfully retrieved ${productList?.items?.length} product(s)`);
    return productList;
  },
};
