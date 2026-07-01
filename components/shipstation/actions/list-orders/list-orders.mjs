import shipstation from "../../shipstation.app.mjs";

const ORDER_STATUSES = [
  "awaiting_payment",
  "awaiting_shipment",
  "pending_fulfillment",
  "shipped",
  "on_hold",
  "cancelled",
  "rejected_fulfillment",
];

export default {
  key: "shipstation-list-orders",
  name: "List Orders",
  description: "List orders optionally filtered by various criteria. [See the documentation](https://docs.shipstation.com/apis/shipstation-v1/openapi/orders/list_orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shipstation,
    customerName: {
      label: "Customer Name",
      description: "Returns orders that match the specified customer name.",
      type: "string",
      optional: true,
    },
    itemKeyword: {
      label: "Item Keyword",
      description: "Returns orders that contain items that match the specified keyword. Fields searched are Sku, Description, and Options.",
      type: "string",
      optional: true,
    },
    createDateStart: {
      label: "Create Date Start",
      description: "Returns orders created in ShipStation after the specified date. E.g. `2015-01-01 00:00:00`",
      type: "string",
      optional: true,
    },
    createDateEnd: {
      label: "Create Date End",
      description: "Returns orders created in ShipStation before the specified date. E.g. `2015-01-08 00:00:00`",
      type: "string",
      optional: true,
    },
    modifyDateStart: {
      label: "Modify Date Start",
      description: "Returns orders modified after the specified date. E.g. `2015-01-01 00:00:00`",
      type: "string",
      optional: true,
    },
    modifyDateEnd: {
      label: "Modify Date End",
      description: "Returns orders modified before the specified date. E.g. `2015-01-08 00:00:00`",
      type: "string",
      optional: true,
    },
    orderDateStart: {
      label: "Order Date Start",
      description: "Returns orders greater than the specified date. E.g. `2015-01-01 00:00:00`",
      type: "string",
      optional: true,
    },
    orderDateEnd: {
      label: "Order Date End",
      description: "Returns orders less than or equal to the specified date. E.g. `2015-01-08 00:00:00`",
      type: "string",
      optional: true,
    },
    orderNumber: {
      label: "Order Number",
      description: "Filter by order number using a \"starts with\" search.",
      type: "string",
      optional: true,
    },
    orderStatus: {
      label: "Order Status",
      description: "Filter orders by status.",
      type: "string",
      options: ORDER_STATUSES,
      optional: true,
    },
    paymentDateStart: {
      label: "Payment Date Start",
      description: "Returns orders paid after the specified date. E.g. `2015-01-01 00:00:00`",
      type: "string",
      optional: true,
    },
    paymentDateEnd: {
      label: "Payment Date End",
      description: "Returns orders paid before the specified date. E.g. `2015-01-08 00:00:00`",
      type: "string",
      optional: true,
    },
    storeId: {
      propDefinition: [
        shipstation,
        "storeId",
      ],
      optional: true,
    },
    sortBy: {
      label: "Sort By",
      description: "Sort orders by a specific field.",
      type: "string",
      options: [
        "OrderDate",
        "ModifyDate",
        "CreateDate",
      ],
      optional: true,
    },
    sortDir: {
      label: "Sort Direction",
      description: "Sort direction for results.",
      type: "string",
      options: [
        "ASC",
        "DESC",
      ],
      optional: true,
    },
    page: {
      label: "Page",
      description: "Page number for pagination. Default is `1`.",
      type: "integer",
      optional: true,
    },
    pageSize: {
      label: "Page Size",
      description: "Number of results per page. Maximum is `500`.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      customerName,
      itemKeyword,
      createDateStart,
      createDateEnd,
      modifyDateStart,
      modifyDateEnd,
      orderDateStart,
      orderDateEnd,
      orderNumber,
      orderStatus,
      paymentDateStart,
      paymentDateEnd,
      storeId,
      sortBy,
      sortDir,
      page,
      pageSize,
    } = this;

    const response = await this.shipstation.listOrders({
      params: {
        customerName,
        itemKeyword,
        createDateStart,
        createDateEnd,
        modifyDateStart,
        modifyDateEnd,
        orderDateStart,
        orderDateEnd,
        orderNumber,
        orderStatus,
        paymentDateStart,
        paymentDateEnd,
        storeId,
        sortBy,
        sortDir,
        page,
        pageSize,
      },
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.total} order(s).`);

    return response;
  },
};
