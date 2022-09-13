import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-find-contact",
  name: "Find Contact",
  description: "Searches for contacts in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Search#Search_SearchContacts)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
