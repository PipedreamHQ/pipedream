import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-list-products",
  name: "List Products",
  description: "List a list of products. [See the documentation](https://apidocs.orderspace.com/#list-products)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orderspace,
    createdSince: {
      type: "string",
      label: "Created Since",
      description: "Return records created since the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "Return records updated since the given date and time in ISO 8601 format, e.g. 2019-10-29T21:00",
      optional: true,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Return products with the specified code",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Return products with the specified name",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Return products with the specified active status",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        orderspace,
        "categoryId",
      ],
      description: "Return products in the specified category",
    },
    maxResults: {
      propDefinition: [
        orderspace,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { products } = await this.orderspace.listProducts({
      $,
      params: {
        created_since: this.createdSince,
        updated_since: this.updatedSince,
        code: this.code,
        name: this.name,
        active: this.active,
        category_id: this.categoryId,
        limit: this.maxResults,
      },
    });
    $.export("$summary", `Successfully listed ${products.length} products`);
    return products;
  },
};
