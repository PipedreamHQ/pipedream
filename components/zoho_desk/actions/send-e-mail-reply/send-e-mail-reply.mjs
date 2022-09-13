import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-send-e-mail-reply",
  name: "Send E-Mail Reply",
  description: "Sends an email reply. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_SendEmailReply)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoDesk,
  },
  async run() {},
};
