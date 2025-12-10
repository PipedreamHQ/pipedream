import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-list-tickets",
  name: "List Tickets",
  description: "List all tickets. [See the docs](https://developers.gorgias.com/reference/get_api-tickets)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gorgias_oauth,
    customerId: {
      propDefinition: [
        gorgias_oauth,
        "customerId",
      ],
      description: "The ID of a customer used to select their tickets",
      optional: true,
    },
    limit: {
      propDefinition: [
        gorgias_oauth,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      customer_id: this.customerId,
      limit: this.limit,
    };

    const tickets = [];
    const paginator = this.gorgias_oauth.paginate({
      $,
      fn: this.gorgias_oauth.listTickets,
      params,
    });
    for await (const ticket of paginator) {
      tickets.push(ticket);
    }

    const suffix = tickets.length === 1
      ? ""
      : "s";
    $.export("$summary", `Returned ${tickets.length} ticket${suffix}`);
    return tickets;
  },
};
