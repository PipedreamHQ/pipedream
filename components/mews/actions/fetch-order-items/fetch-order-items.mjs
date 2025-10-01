import app from "../../mews.app.mjs";

export default {
  name: "Fetch Order Items",
  description: "Retrieve order items using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/orderitems#get-all-order-items)",
  key: "mews-fetch-order-items",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    createdStartUtc: {
      description: "Start of the interval in which Order item was created. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "createdStartUtc",
      ],
    },
    createdEndUtc: {
      description: "End of the interval in which Order item was created. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "createdEndUtc",
      ],
    },
    updatedStartUtc: {
      description: "Start of the interval in which Order item was updated. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedStartUtc",
      ],
    },
    updatedEndUtc: {
      description: "End of the interval in which Order item was updated. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedEndUtc",
      ],
    },
    consumedStartUtc: {
      type: "string",
      label: "Consumed Start (UTC)",
      description: "Start of the interval in which Order item was consumed. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    consumedEndUtc: {
      type: "string",
      label: "Consumed End (UTC)",
      description: "End of the interval in which Order item was consumed. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    canceledStartUtc: {
      type: "string",
      label: "Canceled Start (UTC)",
      description: "Start of the interval in which Order item was canceled. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    canceledEndUtc: {
      type: "string",
      label: "Canceled End (UTC)",
      description: "End of the interval in which Order item was canceled. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    closedStartUtc: {
      type: "string",
      label: "Closed Start (UTC)",
      description: "Start of the interval in which Order item was closed. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    closedEndUtc: {
      type: "string",
      label: "Closed End (UTC)",
      description: "End of the interval in which Order item was closed. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    enterpriseIds: {
      propDefinition: [
        app,
        "enterpriseIds",
      ],
    },
    orderItemIds: {
      propDefinition: [
        app,
        "orderItemIds",
      ],
    },
    accountType: {
      propDefinition: [
        app,
        "accountType",
      ],
    },
    accountIds: {
      type: "string[]",
      label: "Account IDs",
      description: "Unique identifiers of specific Accounts to which the order items belong to. Required if no other filter is provided. Max 100 items.",
      optional: true,
      propDefinition: [
        app,
        "accountId",
        ({ accountType }) => ({
          accountType,
        }),
      ],
    },
    serviceOrderIds: {
      type: "string[]",
      label: "Service Order IDs",
      description: "Unique identifiers of the service orders (product service orders or reservations). Required if no other filter is provided. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "reservationId",
      ],
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Unique identifiers of the Services. Required if no other filter is provided. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    billIds: {
      type: "string[]",
      label: "Bill IDs",
      description: "Unique identifiers of the Bills to which order item is assigned. Required if no other filter is provided. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "billId",
      ],
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO-4217 code of the Currency the item costs should be converted to.",
      optional: true,
    },
    accountingStates: {
      type: "string[]",
      label: "Accounting States",
      description: "Accounting state of the item. Max 1000 items.",
      optional: true,
      options: [
        "Open",
        "Closed",
        "Deferred",
        "Canceled",
      ],
    },
    types: {
      type: "string[]",
      label: "Types",
      description: "Order item type, e.g. whether product order or space order. Max 1000 items.",
      optional: true,
      options: [
        "ProductOrder",
        "SpaceOrder",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      createdStartUtc,
      createdEndUtc,
      updatedStartUtc,
      updatedEndUtc,
      consumedStartUtc,
      consumedEndUtc,
      canceledStartUtc,
      canceledEndUtc,
      closedStartUtc,
      closedEndUtc,
      enterpriseIds,
      orderItemIds,
      accountIds,
      serviceOrderIds,
      serviceIds,
      billIds,
      currency,
      accountingStates,
      types,
    } = this;

    const items = await app.paginate({
      requester: app.orderItemsGetAll,
      requesterArgs: {
        $,
        data: {
          ...(createdStartUtc || createdEndUtc) && {
            CreatedUtc: {
              StartUtc: createdStartUtc,
              EndUtc: createdEndUtc,
            },
          },
          ...(updatedStartUtc || updatedEndUtc) && {
            UpdatedUtc: {
              StartUtc: updatedStartUtc,
              EndUtc: updatedEndUtc,
            },
          },
          ...(consumedStartUtc || consumedEndUtc) && {
            ConsumedUtc: {
              StartUtc: consumedStartUtc,
              EndUtc: consumedEndUtc,
            },
          },
          ...(canceledStartUtc || canceledEndUtc) && {
            CanceledUtc: {
              StartUtc: canceledStartUtc,
              EndUtc: canceledEndUtc,
            },
          },
          ...(closedStartUtc || closedEndUtc) && {
            ClosedUtc: {
              StartUtc: closedStartUtc,
              EndUtc: closedEndUtc,
            },
          },
          EnterpriseIds: enterpriseIds,
          OrderItemIds: orderItemIds,
          AccountIds: accountIds,
          ServiceOrderIds: serviceOrderIds,
          ServiceIds: serviceIds,
          BillIds: billIds,
          Currency: currency,
          AccountingStates: accountingStates,
          Types: types,
        },
      },
      resultKey: "OrderItems",
    });

    $.export("$summary", `Successfully fetched ${items.length} order item${items.length !== 1
      ? "s"
      : ""}`);
    return items;
  },
};

