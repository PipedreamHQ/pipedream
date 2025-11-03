import app from "../../billbee.app.mjs";

export default {
  key: "billbee-list-orders",
  name: "List Orders",
  description: "Retrieve a list of orders. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_GetList)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    minOrderDate: {
      type: "string",
      label: "Minimum Order Date",
      description: "Specifies the oldest order date to include in the response (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    maxOrderDate: {
      type: "string",
      label: "Maximum Order Date",
      description: "Specifies the newest order date to include in the response (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    shopId: {
      type: "string[]",
      label: "Shop IDs",
      description: "Specifies a list of shop IDs for which orders should be included",
      propDefinition: [
        app,
        "shopId",
      ],
    },
    orderStateId: {
      type: "string[]",
      label: "Order State IDs",
      description: "Specifies a list of state IDs to include in the response",
      propDefinition: [
        app,
        "orderStateId",
      ],
    },
    tag: {
      type: "string[]",
      label: "Tags",
      description: "Specifies a list of tags the order must have attached to be included in the response",
      optional: true,
    },
    minimumBillBeeOrderId: {
      type: "integer",
      label: "Minimum Billbee Order ID",
      description: "If given, all delivered orders have an ID greater than or equal to the given minimumOrderId",
      optional: true,
    },
    modifiedAtMin: {
      type: "string",
      label: "Modified At Minimum",
      description: "If given, the last modification has to be newer than the given date (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    modifiedAtMax: {
      type: "string",
      label: "Modified At Maximum",
      description: "If given, the last modification has to be older or equal than the given date (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    articleTitleSource: {
      type: "integer",
      label: "Article Title Source",
      description: "The source field for the article title",
      optional: true,
      options: [
        {
          label: "Order Position (default)",
          value: 0,
        },
        {
          label: "Article Title",
          value: 1,
        },
        {
          label: "Article Invoice Text",
          value: 2,
        },
      ],
    },
    excludeTags: {
      type: "boolean",
      label: "Exclude Tags",
      description: "If `true` the list of tags passed to the call are used to filter orders to not include these tags",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum number of orders to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      max,
      minOrderDate,
      maxOrderDate,
      shopId,
      orderStateId,
      tag,
      minimumBillBeeOrderId,
      modifiedAtMin,
      modifiedAtMax,
      articleTitleSource,
      excludeTags,
    } = this;

    const orders = await app.paginate({
      resourcesFn: app.listOrders,
      resourcesFnArgs: {
        $,
        params: {
          minOrderDate,
          maxOrderDate,
          shopId,
          orderStateId,
          tag,
          minimumBillBeeOrderId,
          modifiedAtMin,
          modifiedAtMax,
          articleTitleSource,
          excludeTags,
        },
      },
      resourceName: "Data",
      max,
    });

    $.export("$summary", `Successfully retrieved \`${orders.length}\` orders`);

    return orders;
  },
};
