import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-add-ticket-comment",
  name: "Add Ticket Comment",
  description: "Adds a comment to a ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketsComments#TicketsComments_Createticketcomment)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
