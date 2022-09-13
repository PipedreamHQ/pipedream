import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-update-ticket",
  name: "Update Ticket",
  description: "Updates an existing ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Updateaticket)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
