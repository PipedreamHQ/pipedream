import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-contact",
  name: "Create Contact",
  description: "Creates a contact in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_CreateContact)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
