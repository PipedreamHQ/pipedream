import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-search-ticket",
  name: "Search Ticket",
  description: "Searches for tickets in your help desk. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Search_TicketsSearchAPI)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
