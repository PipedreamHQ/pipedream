import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-list-products",
  name: "List Products",
  description: "List products in an Everstox shop. [See the documentation](https://api.staging.everstox.com/api/v1/ui/#/Product/district_core.api.shops.products.products.Products.index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    sku: {
      type: "string",
      label: "SKU",
      description: "Filter products by SKU",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter products by name",
      optional: true,
    },
    warehouseIds: {
      propDefinition: [
        everstox,
        "warehouseIds",
      ],
      optional: true,
    },
    createdDateGte: {
      type: "string",
      label: "Created Date Greater Than or Equal To",
      description: "Filter products with a creation date greater than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    createdDateLte: {
      type: "string",
      label: "Created Date Less Than or Equal To",
      description: "Filter products with a creation date less than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    updatedDateGte: {
      type: "string",
      label: "Updated Date Greater Than or Equal To",
      description: "Filter products with an updated date greater than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    updatedDateLte: {
      type: "string",
      label: "Updated Date Less Than or Equal To",
      description: "Filter products with an updated date less than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of products to return (default 10)",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of products to skip before starting to collect the result set",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everstox.listProducts({
      $,
      params: {
        sku: this.sku,
        name: this.name,
        warehouse_ids: this.warehouseIds,
        creation_date_gte: this.createdDateGte,
        creation_date_lte: this.createdDateLte,
        updated_date_gte: this.updatedDateGte,
        updated_date_lte: this.updatedDateLte,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const count = response.items?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} product${count === 1
      ? ""
      : "s"}`);

    return response;
  },
};
