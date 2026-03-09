import returnless from "../../returnless.app.mjs";

export default {
  key: "returnless-list-return-orders",
  name: "List Return Orders",
  description: "Retrieve a list of return orders. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/0640e3c064cdc-list-all-return-orders)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnless,
    returnType: {
      type: "string",
      label: "Return Type",
      description: "The type of return orders to retrieve",
      options: [
        "request",
        "return",
      ],
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only return return-orders that were created after the given date. Example: `2025-01-01T00:00:00+00:00`",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only return return-orders that were created before the given date. Example: `2025-01-10T00:00:00+00:00`",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Only return return-orders that were updated after the given date. Example: `2025-01-01T00:00:00+00:00`",
      optional: true,
    },
    updatedBefore: {
      type: "string",
      label: "Updated Before",
      description: "Only return return-orders that were updated before the given date. Example: `2025-01-10T00:00:00+00:00`",
      optional: true,
    },
    finalizedAfter: {
      type: "string",
      label: "Finalized After",
      description: "Only return return-orders that were finalized after the given date. Example: `2025-01-01T00:00:00+00:00`",
      optional: true,
    },
    finalizedBefore: {
      type: "string",
      label: "Finalized Before",
      description: "Only return return-orders that were finalized before the given date. Example: `2025-01-10T00:00:00+00:00`",
      optional: true,
    },
    orderDateAfter: {
      type: "string",
      label: "Order Date After",
      description: "Only return return-orders that were ordered after the given date. Example: `2025-01-01T00:00:00+00:00`",
      optional: true,
    },
    orderDateBefore: {
      type: "string",
      label: "Order Date Before",
      description: "Only return return-orders that were ordered before the given date. Example: `2025-01-10T00:00:00+00:00`",
      optional: true,
    },
    returnNumber: {
      propDefinition: [
        returnless,
        "returnOrderNumber",
      ],
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        returnless,
        "orderNumber",
      ],
      optional: true,
    },
    returnStatus: {
      propDefinition: [
        returnless,
        "returnStatusId",
      ],
      description: "The ID of the return status to filter by",
      optional: true,
    },
    requestStatus: {
      propDefinition: [
        returnless,
        "requestStatusId",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        returnless,
        "maxResults",
      ],
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the return-orders by",
      optional: true,
      options: [
        {
          label: "Order Date (ascending)",
          value: "order_date",
        },
        {
          label: "Order Date (descending)",
          value: "-order_date",
        },
        {
          label: "Created At (ascending)",
          value: "created_at",
        },
        {
          label: "Created At (descending)",
          value: "-created_at",
        },
        {
          label: "Updated At (ascending)",
          value: "updated_at",
        },
        {
          label: "Updated At (descending)",
          value: "-updated_at",
        },
      ],
    },
  },
  async run({ $ }) {
    const returnOrders = await this.returnless.getPaginatedResources({
      fn: this.returnless.listReturnOrders,
      args: {
        $,
        params: {
          "filter": {
            return_type: this.returnType,
            created_at: {
              gt: this.createdAfter,
              lt: this.createdBefore,
            },
            updated_at: {
              gt: this.updatedAfter,
              lt: this.updatedBefore,
            },
            finalized_at: {
              gt: this.finalizedAfter,
              lt: this.finalizedBefore,
            },
            order_date: {
              gt: this.orderDateAfter,
              lt: this.orderDateBefore,
            },
          },
          "filters": {
            order_number: this.orderNumber,
            return_number: this.returnNumber,
          },
          "filter[request_status]": this.requestStatus,
          "filter[return_status]": this.returnStatus,
          "sort": this.sort,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${returnOrders.length} return order${returnOrders.length === 1
      ? ""
      : "s"}`);
    return returnOrders;
  },
};
