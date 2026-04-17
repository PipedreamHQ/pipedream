import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-get-ticket-comment",
  name: "Get Ticket Comment",
  description: "Retrieves details of a specific comment on a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketsComments_Getticketcomment)",
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

    const response = await this.zohoDesk.getTicketComment({
      $,
      ticketId,
      commentId,
      headers: {
        orgId,
      },
    });

    $.export("$summary", `Successfully retrieved comment with ID ${commentId}`);

    return response;
  },
};
