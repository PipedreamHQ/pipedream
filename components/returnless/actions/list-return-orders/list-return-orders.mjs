import returnless from "../../returnless.app.mjs";

export default {
  key: "returnless-list-return-orders",
  name: "List Return Orders",
  description: "Retrieve a list of return orders. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/0640e3c064cdc-list-all-return-orders)",
  version: "0.0.3",
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
    maxResults: {
      propDefinition: [
        returnless,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const returnOrders = await this.returnless.getPaginatedResources({
      fn: this.returnless.listReturnOrders,
      args: {
        $,
        params: {
          filter: {
            return_type: this.returnType,
            created_at: {
              gt: this.createdAfter,
              lt: this.createdBefore,
            },
          },
          sort: "-created_at",
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
