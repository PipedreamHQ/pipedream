import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-ticket-attachments",
  name: "List Ticket Attachments",
  description: "List attachments for a specific ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#TicketAttachments_Listticketattachments)",
  type: "action",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
    } = this;

    const response = await this.zohoDesk.getTicketAttachments({
      $,
      ticketId,
      headers: {
        orgId,
      },
    });

    const attachments = response.data || [];
    $.export("$summary", `Successfully retrieved ${attachments.length} attachment(s)`);

    return attachments;
  },
};

