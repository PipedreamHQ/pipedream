import bolCom from "../../bol_com.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bol_com-list-orders",
  name: "List Orders",
  description: "List orders. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Orders/operation/get-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    page: {
      propDefinition: [
        bolCom,
        "page",
      ],
    },
    fulfilmentMethod: {
      type: "string",
      label: "Fulfilment Method",
      description: "Fulfilled by the retailer (FBR) or fulfilled by bol.com (FBB). In order to retrieve both FBR and FBB orders, ALL can be used as a parameter.",
      options: constants.ORDER_FULFILMENT_METHOD_OPTIONS,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "You can filter orders based on their status with the following options: all orders, which include every order regardless of its current status; open orders, which show only the active orders excluding those that have been shipped or cancelled; and shipped orders, which display only the orders that have been shipped.",
      options: constants.ORDER_STATUS_OPTIONS,
      optional: true,
    },
    changeIntervalMinute: {
      type: "integer",
      label: "Change Interval Minute",
      description: "Indicate the period in minutes, to filter order items based on their most recent change",
      optional: true,
    },
    latestChangeDate: {
      type: "string",
      label: "Latest Change Date",
      description: "To filter on the date on which the latest change was performed on an order item. Up to 3 months of history is supported.",
      optional: true,
    },
    vvb: {
      type: "boolean",
      label: "VVB",
      description: "Filters results to include only orders fulfilled through VVB",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.listOrders({
      $,
      params: {
        "page": this.page,
        "fulfilment-method": this.fulfilmentMethod,
        "status": this.status,
        "change-interval-minute": this.changeIntervalMinute,
        "latest-change-date": this.latestChangeDate,
        "vvb": this.vvb,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.orders.length} order${response.orders.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
