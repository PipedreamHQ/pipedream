import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-find-or-create-contact",
  name: "Find or Create Contact",
  description: "Finds or create a contact. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_CreateContact)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
