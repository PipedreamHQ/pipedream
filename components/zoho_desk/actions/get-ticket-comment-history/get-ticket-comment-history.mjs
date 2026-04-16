import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-get-ticket-comment-history",
  name: "Get Ticket Comment History",
  description: "Retrieves the edit history of a specific ticket comment. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketsComments_Getaticketcommenthistory)",
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
    commentId: {
      propDefinition: [
        zohoDesk,
        "commentId",
        ({
          orgId, ticketId,
        }) => ({
          orgId,
          ticketId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      commentId,
    } = this;

    const response = await this.zohoDesk.getTicketCommentHistory({
      $,
      ticketId,
      commentId,
      headers: {
        orgId,
      },
    });

    const history = response.data || response;
    $.export("$summary", `Successfully retrieved history for comment with ID ${commentId}`);

    return history;
  },
};
