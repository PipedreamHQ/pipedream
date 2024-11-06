import zendeskSell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-create-lead",
  name: "Create Lead",
  description: "Creates a new lead. [See the documentation](https://developer.zendesk.com/api-reference/sales-crm/resources/leads/#create-a-lead).",
  type: "action",
  version: "0.0.{{ts}}",
  props: {
    zendeskSell,
  },
  async run() {

  },
};
