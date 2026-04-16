import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-delete-ticket-comment",
  name: "Delete Ticket Comment",
  description: "Deletes a specific comment from a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketsComments_Deleteticketcomment)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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

    await this.zohoDesk.deleteTicketComment({
      $,
      ticketId,
      commentId,
      headers: {
        orgId,
      },
    });

    $.export("$summary", `Successfully deleted comment with ID ${commentId}`);

    return {
      success: true,
    };
  },
};
