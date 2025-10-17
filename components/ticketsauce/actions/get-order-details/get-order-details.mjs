import ticketsauce from "../../ticketsauce.app.mjs";

export default {
  key: "ticketsauce-get-order-details",
  name: "Get Order Details",
  description: "Get details for the specified order. [See documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#order-details)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ticketsauce,
    partnerId: {
      type: "string",
      label: "Partner ID",
      description: "Including this ID will limit the event selection to the specific partner.",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "Including this ID will limit the event selection to the specific organization.",
      optional: true,
    },
    eventId: {
      propDefinition: [
        ticketsauce,
        "eventId",
        (c) => ({
          partnerId: c.partnerId,
          organizationId: c.organizationId,
        }),
      ],
    },
    orderId: {
      propDefinition: [
        ticketsauce,
        "orderId",
        (c) => ({
          eventId: c.eventId,
        }),
      ],
    },
  },
  async run() {
    return this.ticketsauce.getOrderDetails({
      orderId: this.orderId,
    });
  },
};
