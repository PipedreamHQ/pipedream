import app from "../../nuvemshop.app.mjs";

export default {
  key: "nuvemshop-get-products",
  name: "Get Products",
  description: "Retrieves a list of products. [See the documentation](https://tiendanube.github.io/api-documentation/resources/product#get-products)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search products by name, tags, or SKU",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
      optional: true,
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "Filter by publication status",
      optional: true,
    },
    freeShipping: {
      type: "boolean",
      label: "Free Shipping",
      description: "Filter products with free shipping",
      optional: true,
    },
    minStock: {
      type: "integer",
      label: "Min Stock",
      description: "Filter products with stock greater than or equal to this value",
      optional: true,
    },
    maxStock: {
      type: "integer",
      label: "Max Stock",
      description: "Filter products with stock less than or equal to this value",
      optional: true,
    },
    createdAtMin: {
      type: "string",
      label: "Created At Min",
      description: "Show products created after this date (ISO 8601 format)",
      optional: true,
    },
    createdAtMax: {
      type: "string",
      label: "Created At Max",
      description: "Show products created before this date (ISO 8601 format)",
      optional: true,
    },
    updatedAtMin: {
      type: "string",
      label: "Updated At Min",
      description: "Show products updated after this date (ISO 8601 format)",
      optional: true,
    },
    updatedAtMax: {
      type: "string",
      label: "Updated At Max",
      description: "Show products updated before this date (ISO 8601 format)",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort products by a particular criteria (Example: `created-at-ascending`)",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to include in the response",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of products to return. Leave blank to retrieve all products.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      q,
      categoryId,
      published,
      freeShipping,
      minStock,
      maxStock,
      createdAtMin,
      createdAtMax,
      updatedAtMin,
      updatedAtMax,
      sortBy,
      fields,
      max,
    } = this;

    const products = [];
    const paginator = app.paginate({
      resourceFn: app.listProducts,
      params: {
        q,
        category_id: categoryId,
        published,
        free_shipping: freeShipping,
        min_stock: minStock,
        max_stock: maxStock,
        created_at_min: createdAtMin,
        created_at_max: createdAtMax,
        updated_at_min: updatedAtMin,
        updated_at_max: updatedAtMax,
        sort_by: sortBy,
        fields,
      },
      max,
    });

    for await (const product of paginator) {
      products.push(product);
    }

    $.export("$summary", `Successfully retrieved ${products.length} product${products.length === 1
      ? ""
      : "s"}`);
    return products;
  },
};
