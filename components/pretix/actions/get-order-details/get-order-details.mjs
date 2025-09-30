import pretix from "../../pretix.app.mjs";

export default {
  key: "pretix-get-order-details",
  name: "Get Order Details",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Returns information on one order, identified by its order code. [See the documentation](https://docs.pretix.eu/en/latest/api/resources/orders.html#fetching-individual-orders)",
  type: "action",
  props: {
    pretix,
    organizerSlug: {
      propDefinition: [
        pretix,
        "organizerSlug",
      ],
    },
    eventSlug: {
      propDefinition: [
        pretix,
        "eventSlug",
        ({ organizerSlug }) => ({
          organizerSlug,
        }),
      ],
    },
    orderCode: {
      propDefinition: [
        pretix,
        "orderCode",
        ({
          organizerSlug, eventSlug,
        }) => ({
          organizerSlug,
          eventSlug,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      pretix,
      organizerSlug,
      eventSlug,
      orderCode,
    } = this;

    const response = await pretix.getOrderDetails({
      $,
      organizerSlug,
      eventSlug,
      orderCode,
    });

    $.export("$summary", `The order with code: ${orderCode} was successfully fetched!`);
    return response;
  },
};
