import constants from "../../common/constants.mjs";
import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-list-products",
  name: "List Products",
  description: "List products in an Everstox shop. Use this to browse or audit the product catalog, check inventory by SKU or name, or filter by warehouse. Results default to 10 per page — use `limit` and `offset` together to paginate through large catalogs. [See the documentation](https://api.everstox.com/api/v1/ui/#/Product/district_core.api.shops.products.products.Products.index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    search: {
      type: "string",
      label: "Search",
      description: "Search for name or SKU",
      optional: true,
    },
    sku: {
      type: "string[]",
      label: "SKUs",
      description: "Filter products by SKU. If the number of SKUs exceeds 10, `exact_search` is enforced",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter products by name",
      optional: true,
    },
    gtin: {
      type: "string",
      label: "GTIN",
      description: "Filter products by GTIN — returns products with at least one unit whose GTIN contains this value",
      optional: true,
    },
    customAttributeKey: {
      type: "string",
      label: "Custom Attribute Key",
      description: "Filter products by custom attribute key — returns products with at least one custom attribute whose key contains this value",
      optional: true,
    },
    customAttributeValue: {
      type: "string",
      label: "Custom Attribute Value",
      description: "Filter products by custom attribute value — returns products with at least one custom attribute whose value contains this value",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter products by status (default `all`)",
      options: constants.STATUS_OPTIONS,
      optional: true,
    },
    bundleProduct: {
      type: "boolean",
      label: "Bundle Product",
      description: "Filter for bundle products",
      optional: true,
    },
    exactSearch: {
      type: "boolean",
      label: "Exact Search",
      description: "If true, searches for exact SKU and name matches (default `true`)",
      optional: true,
    },
    stockRunwayLte: {
      type: "integer",
      label: "Stock Runway Less Than or Equal To",
      description: "Filter for stocks with runway lower than or equal to the number of days provided",
      optional: true,
    },
    stockRunwayLt: {
      type: "integer",
      label: "Stock Runway Less Than",
      description: "Filter for stocks with runway lower than the number of days provided",
      optional: true,
    },
    stockRunwayGte: {
      type: "integer",
      label: "Stock Runway Greater Than or Equal To",
      description: "Filter for stocks with runway greater than or equal to the number of days provided",
      optional: true,
    },
    warehouseIds: {
      propDefinition: [
        everstox,
        "warehouseIds",
      ],
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Fields to order the result set by",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Fields to include in the response",
      optional: true,
    },
    fieldSet: {
      type: "string",
      label: "Field Set",
      description: "`full` includes all sub-entities (default); `minimal` returns essential fields optimized for performance",
      options: constants.FIELD_SET_OPTIONS,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of products to return (default 10)",
      min: 1,
      default: 10,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of products to skip before starting to collect the result set",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everstox.listProducts({
      $,
      params: {
        search: this.search,
        sku: this.sku,
        name: this.name,
        gtin: this.gtin,
        custom_attribute_key: this.customAttributeKey,
        custom_attribute_value: this.customAttributeValue,
        status: this.status,
        bundle_product: this.bundleProduct,
        exact_search: this.exactSearch,
        stock_runway_lte: this.stockRunwayLte,
        stock_runway_lt: this.stockRunwayLt,
        stock_runway_gte: this.stockRunwayGte,
        warehouse_ids: this.warehouseIds,
        order_by: this.orderBy,
        fields: this.fields,
        field_set: this.fieldSet,
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
