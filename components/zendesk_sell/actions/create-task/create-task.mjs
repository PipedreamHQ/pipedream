import zendeskSell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://developer.zendesk.com/api-reference/sales-crm/resources/tasks/#create-a-task).",
  type: "action",
  version: "0.0.{{ts}}",
  props: {
    zendeskSell,
  },
  async run() {

  },
};
