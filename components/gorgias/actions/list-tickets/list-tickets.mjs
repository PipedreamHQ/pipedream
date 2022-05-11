import gorgias from "../../gorgias.app.mjs";

export default {
  key: "gorgias-list-tickets",
  name: "List Tickets",
  description: "List all tickets. [See the docs](https://developers.gorgias.com/reference/get_api-tickets)",
  version: "0.0.2",
  type: "action",
  props: {
    gorgias,
    customerId: {
      propDefinition: [
        gorgias,
        "customerId",
      ],
      description: "The ID of a customer used to select their tickets",
      optional: true,
    },
    limit: {
      propDefinition: [
        gorgias,
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
    const paginator = this.gorgias.paginate({
      $,
      fn: this.gorgias.listTickets,
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
