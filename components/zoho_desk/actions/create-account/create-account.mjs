import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-account",
  name: "Create Account",
  description: "Creates an account in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Accounts#Accounts_CreateAccount)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
