import zendeskSell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://developer.zendesk.com/api-reference/sales-crm/resources/contacts/#create-a-contact).",
  type: "action",
  version: "0.0.{{ts}}",
  props: {
    zendeskSell,
  },
  async run() {

  },
};
