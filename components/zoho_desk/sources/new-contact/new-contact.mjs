import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_Listcontacts)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoDesk,
  },
  async run() {},
};
