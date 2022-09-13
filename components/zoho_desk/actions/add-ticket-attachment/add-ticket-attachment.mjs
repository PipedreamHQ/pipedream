import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-add-ticket-attachment",
  name: "Add Ticket Attachment",
  description: "Attaches a file to a ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketAttachments)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
