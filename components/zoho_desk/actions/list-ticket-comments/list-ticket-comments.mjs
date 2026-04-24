import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-ticket-comments",
  name: "List All Ticket Comments",
  description: "Retrieves all comments for a specified ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketsComments_Listallticketcomments)",
  type: "action",
  version: "0.0.2",
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
    ticketId: {
      propDefinition: [
        zohoDesk,
        "ticketId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    from: {
      propDefinition: [
        zohoDesk,
        "from",
      ],
    },
    limit: {
      propDefinition: [
        zohoDesk,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      from,
      limit,
    } = this;

    const params = {};
    if (from) params.from = from;
    if (limit) params.limit = limit;

    const response = await this.zohoDesk.getTicketComments({
      $,
      ticketId,
      headers: {
        orgId,
      },
      params,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length} comment(s) for ticket ID ${ticketId}`);

    return response;
  },
};
