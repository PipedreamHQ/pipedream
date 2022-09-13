import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-update-contact",
  name: "Update Contact",
  description: "Updates details of an existing contact. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_Updateacontact)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
