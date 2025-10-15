import oto from "../../oto.app.mjs";

export default {
  key: "oto-list-orders",
  name: "List Orders",
  description: "Retrieves a list of orders. [See the documentation](https://apis.tryoto.com/#c2e94027-5214-456d-b653-0a66c038e3a4)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    oto,
    status: {
      propDefinition: [
        oto,
        "status",
      ],
    },
    minDate: {
      type: "string",
      label: "Min Date",
      description: "Starting \"Order Creation Date\" of your orders in \"yyyy-mm-dd\" format",
      optional: true,
    },
    maxDate: {
      type: "string",
      label: "Max Date",
      description: "Ending \"Order Creation Date\" of your orders in \"yyyy-mm-dd\" format",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of orders to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.oto.paginate({
      fn: this.oto.listOrders,
      args: {
        $,
        params: {
          minDate: this.minDate,
          maxDate: this.maxDate,
          status: this.status,
        },
      },
      resourceKey: "orders",
      max: this.maxResults,
    });

    const orders = [];
    for await (const order of results) {
      orders.push(order);
    }

    if (orders[0].items?.length) {
      $.export("$summary", `Successfully retrieved ${orders.length} order${orders.length === 1
        ? ""
        : "s"}`);
    } else {
      $.export("$summary", "No orders found");
    }
    return orders;
  },
};
