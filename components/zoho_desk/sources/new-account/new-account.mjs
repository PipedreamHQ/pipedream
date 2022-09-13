import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-new-account",
  name: "New Account",
  description: "Emit new event when a new account is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Accounts#Accounts_Listaccounts)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoDesk,
  },
  async run() {},
};
