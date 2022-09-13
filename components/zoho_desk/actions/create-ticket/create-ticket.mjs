import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-ticket",
  name: "Create Ticket",
  description: "Creates a ticket in your helpdesk. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Createaticket)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
