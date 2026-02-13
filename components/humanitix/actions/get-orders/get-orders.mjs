import humanitix from "../../humanitix.app.mjs";

export default {
  key: "humanitix-get-orders",
  name: "Get Orders",
  description: "Retrieves a list of orders from Humanitix. [See the documentation](https://humanitix.stoplight.io/docs/humanitix-public-api/468f50b741494-get-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    humanitix,
    eventId: {
      propDefinition: [
        humanitix,
        "eventId",
      ],
    },
    overrideLocation: {
      propDefinition: [
        humanitix,
        "overrideLocation",
      ],
    },
    since: {
      propDefinition: [
        humanitix,
        "since",
      ],
    },
    maxResults: {
      propDefinition: [
        humanitix,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.humanitix.paginate({
      $,
      eventId: this.eventId,
      fn: this.humanitix.getOrders,
      maxResults: this.maxResults,
      dataField: "orders",
    });

    const orders = [];
    for await (const order of response) {
      orders.push(order);
    }

    $.export("$summary", `Successfully retrieved ${orders.length} order${orders.length === 1
      ? ""
      : "s"}`);

    return orders;
  },
};
