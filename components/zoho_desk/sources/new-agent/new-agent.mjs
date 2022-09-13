import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-new-agent",
  name: "New Agent",
  description: "Emit new event when a new agent is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Agents#Agents_Listagents)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoDesk,
  },
  async run() {},
};
