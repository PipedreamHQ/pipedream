import app from "../../shiphero.app.mjs";
import productQueries from "../../common/queries/product.mjs";

export default {
  key: "shiphero-list-products",
  name: "List Products",
  description: "List products. [See the documentation](https://developer.shiphero.com/getting-started/)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sku: {
      type: "string",
      label: "SKU",
      description: "The SKU of the product.",
      optional: true,
    },
    createdFrom: {
      type: "string",
      label: "Created From",
      description: "The date the product was created from. A DateTime field type that understand **ISO 8601** strings, besides datetime objects. It supports strings with and without times, as well as using `T` or space as delimiter\nEg.\n- `YYYY-mm-dd`\n- `YYYY-mm-dd HH:MM:SS`\n - `YYYY-mm-ddTHH:MM:SS`",
      optional: true,
    },
    createdTo: {
      type: "string",
      label: "Created To",
      description: "The date the product was created to. A DateTime field type that understand **ISO 8601** strings, besides datetime objects. It supports strings with and without times, as well as using `T` or space as delimiter\nEg.\n- `YYYY-mm-dd`\n- `YYYY-mm-dd HH:MM:SS`\n - `YYYY-mm-ddTHH:MM:SS`",
      optional: true,
    },
    updatedFrom: {
      type: "string",
      label: "Updated From",
      description: "The date the product was updated from. A DateTime field type that understand **ISO 8601** strings, besides datetime objects. It supports strings with and without times, as well as using `T` or space as delimiter\nEg.\n- `YYYY-mm-dd`\n- `YYYY-mm-dd HH:MM:SS`\n - `YYYY-mm-ddTHH:MM:SS`",
      optional: true,
    },
    updatedTo: {
      type: "string",
      label: "Updated To",
      description: "The date the product was updated to. A DateTime field type that understand **ISO 8601** strings, besides datetime objects. It supports strings with and without times, as well as using `T` or space as delimiter\nEg.\n- `YYYY-mm-dd`\n- `YYYY-mm-dd HH:MM:SS`\n - `YYYY-mm-ddTHH:MM:SS`",
      optional: true,
    },
    customerAccountId: {
      type: "string",
      label: "Customer Account ID",
      description: "The ID of the customer account.",
      optional: true,
    },
    hasKits: {
      type: "boolean",
      label: "Has Kits",
      description: "Whether the product has kits.",
      optional: true,
    },
    analyze: {
      type: "boolean",
      label: "Analyze",
      description: "Whether to analyze the product.",
      optional: true,
    },
  },
  methods: {
    listProducts(variables = {}) {
      return this.app.makeRequest({
        query: productQueries.listProducts,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      listProducts,
      ...variables
    } = this;

    const response = await listProducts(variables);

    step.export("$summary", `Successfully retrieved products with request ID \`${response.products.request_id}\`.`);

    return response;
  },
};
