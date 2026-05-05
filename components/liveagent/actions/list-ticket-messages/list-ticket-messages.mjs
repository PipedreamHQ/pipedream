import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-list-ticket-messages",
  name: "List Ticket Messages",
  description: "List all messages for a specific ticket. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    liveagent,
    ticketId: {
      propDefinition: [
        liveagent,
        "ticketId",
      ],
    },
    page: {
      propDefinition: [
        liveagent,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        liveagent,
        "perPage",
      ],
    },
    sortDir: {
      propDefinition: [
        liveagent,
        "sortDir",
      ],
    },
    sortField: {
      propDefinition: [
        liveagent,
        "sortField",
      ],
    },
    filters: {
      propDefinition: [
        liveagent,
        "filters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.liveagent.listTicketMessages({
      $,
      ticketId: this.ticketId,
      params: {
        _page: this.page,
        _perPage: this.perPage,
        _sortDir: this.sortDir,
        _sortField: this.sortField,
        _filters: this.filters,
      },
    });
    $.export("$summary", `Successfully listed ${response.length} message(s) for ticket with ID: ${this.ticketId}`);
    return response;
  },
};
