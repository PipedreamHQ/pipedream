import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-list-all-tickets",
  name: "List All Tickets",
  description: "List all tickets in Freshservice. [See the documentation](https://api.freshservice.com/v2/#list_all_tickets)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
    orderBy: {
      propDefinition: [
        freshservice,
        "orderBy",
      ],
      optional: true,
    },
    orderType: {
      propDefinition: [
        freshservice,
        "orderType",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of tickets to return (max 100)",
      optional: true,
      default: 30,
      max: 100,
    },
  },
  async run({ $ }) {
    const params = {
      per_page: this.limit,
    };

    if (this.orderBy) {
      params.order_by = this.orderBy;
    }
    if (this.orderType) {
      params.order_type = this.orderType;
    }

    const response = await this.freshservice.listTickets({
      params,
      $,
    });

    const tickets = response.tickets || [];
    $.export("$summary", `Successfully retrieved ${tickets.length} tickets`);
    return response;
  },
};
