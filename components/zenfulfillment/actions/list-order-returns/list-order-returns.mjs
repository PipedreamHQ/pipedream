import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-list-order-returns",
  name: "List Order Returns",
  description: "List all order returns. [See the documentation](https://partner.alaiko.com/docs#tag/OrderReturn/operation/api_partnerorder-return_get_collection)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenfulfillment,
    createdAtMin: {
      type: "string",
      label: "Created At Minimum",
      description: "The minimum creation date of the order return (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    createdAtMax: {
      type: "string",
      label: "Created At Maximum",
      description: "The maximum creation date of the order return (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    updatedAtMin: {
      type: "string",
      label: "Updated At Minimum",
      description: "The minimum update date of the order return (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    updatedAtMax: {
      type: "string",
      label: "Updated At Maximum",
      description: "The maximum update date of the order return (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    sortCreatedAt: {
      type: "string",
      label: "Sort by created at",
      description: "Sort either ascending or descending by the creation date of the order return.",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    sortUpdatedAt: {
      type: "string",
      label: "Sort by updated at",
      description: "Sort either ascending or descending by the update date of the order return.",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    warehouseLocation: {
      type: "string",
      label: "Warehouse Location",
      description: "Filter by warehouse location.",
      optional: true,
    },
    orderName: {
      type: "string",
      label: "Order Name",
      description: "Filter by order name.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return. Default is `1`",
      optional: true,
      default: 1,
    },
    itemsPerPage: {
      type: "integer",
      label: "Items per page",
      description: "The number of items to return. Default is `50`. Maximum is `200`.",
      optional: true,
      default: 50,
      max: 200,
    },
  },
  async run({ $ }) {
    const response = await this.zenfulfillment.listOrderReturns({
      $,
      params: {
        "createdAtMin": this.createdAtMin,
        "createdAtMax": this.createdAtMax,
        "updatedAtMin": this.updatedAtMin,
        "updatedAtMax": this.updatedAtMax,
        "order[createdAt]": this.sortCreatedAt,
        "order[updatedAt]": this.sortUpdatedAt,
        "warehouseLocation": this.warehouseLocation,
        "orderName": this.orderName,
        "page": this.page,
        "itemsPerPage": this.itemsPerPage,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} order return${response.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
