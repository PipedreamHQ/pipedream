import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-search-ticket",
  name: "Search Ticket",
  description: "Searches for tickets in your help desk. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Search_TicketsSearchAPI)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search throughout the ticket with `wildcard search` strategy",
    },
  },
  async run({ $ }) {
    const {
      orgId,
      search,
    } = this;

    const { data: tickets = [] } =
      await this.zohoDesk.searchTickets({
        headers: {
          orgId,
        },
        params: {
          _all: search,
          sortBy: "relevance",
        },
      });

    $.export("$summary", `Successfully found ${tickets.length} ticket(s)`);

    return tickets;
  },
};
