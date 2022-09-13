import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-new-ticket-attachment",
  name: "New Ticket Attachment",
  description: "Emit new event when a new ticket attachment is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketAttachments#TicketAttachments_Listticketattachments)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoDesk,
  },
  async run() {},
};
