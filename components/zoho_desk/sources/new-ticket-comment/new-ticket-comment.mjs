import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-new-ticket-comment",
  name: "New Ticket Comment",
  description: "Emit new event when a new ticket comment is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketsComments#TicketsComments_Listallticketcomments)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoDesk,
  },
  async run() {},
};
