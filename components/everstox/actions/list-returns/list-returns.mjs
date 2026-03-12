import everstox from "../../everstox.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "everstox-list-returns",
  name: "List Returns",
  description: "List returns from Everstox. [See the documentation](https://api.everstox.com/api/v1/ui/#/Returns%20V2/district_core.api.shops.returns_v2.returns_v2.ReturnsV2.index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    orderNumber: {
      propDefinition: [
        everstox,
        "orderNumber",
      ],
      optional: true,
    },
    rmaNumber: {
      type: "string",
      label: "RMA Number",
      description: "Filter by RMA number",
      optional: true,
    },
    updatedDateGte: {
      type: "string",
      label: "Updated Date Greater Than or Equal To",
      description: "Filter returns with updated date greater than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    updatedDateLte: {
      type: "string",
      label: "Updated Date Less Than or Equal To",
      description: "Filter returns with updated date less than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    createdDateGte: {
      type: "string",
      label: "Created Date Greater Than or Equal To",
      description: "Filter returns with created date greater than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    createdDateLte: {
      type: "string",
      label: "Created Date Less Than or Equal To",
      description: "Filter returns with created date less than or equal to the provided date. Example: `2021-02-23`",
      optional: true,
    },
    returnReviewed: {
      type: "boolean",
      label: "Return Reviewed",
      description: "Filter returns by return reviewed status",
      optional: true,
    },
    productSku: {
      type: "string",
      label: "Product SKU",
      description: "Filter returns by product SKU",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of items to return (default 10)",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of items to skip before starting to collect the result set",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The field to order by",
      options: constants.ORDER_BY_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everstox.listReturns({
      $,
      debug: true,
      params: {
        order_number: this.orderNumber,
        stategroup: "all",
        rma_num: this.rmaNumber,
        updated_date_gte: this.updatedDateGte,
        updated_date_lte: this.updatedDateLte,
        creation_date_gte: this.createdDateGte,
        creation_date_lte: this.createdDateLte,
        return_reviewed: this.returnReviewed,
        product_sku: this.productSku,
        limit: this.limit,
        offset: this.offset,
        order_by: this.orderBy,
        exact_search: false,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.items.length} return${response.items.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
