import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-updated-ticket",
  name: "New Updated Ticket",
  description: "Emit new event when a ticket is updated. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Listalltickets)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoDesk,
  },
  async run() {},
};
