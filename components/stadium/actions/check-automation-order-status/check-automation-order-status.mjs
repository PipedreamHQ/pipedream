import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-check-automation-order-status",
  name: "Check Automation Order Status",
  description: "Check the status of an automation order. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Automation-management/operation/checkOrderStatus)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    stadium,
    apiKey: {
      type: "string",
      label: "Automation API Key",
      description: "API key of the webhook automation (e.g., `ryfMiGzMp8ZTisWYbZUhjkVL`)",
      secret: true,
    },
    orderIdentifier: {
      type: "string",
      label: "Order Identifier",
      description: "Identifier of the automation order to check",
    },
  },
  async run({ $ }) {
    const response = await this.stadium.checkAutomationOrderStatus({
      $,
      apiKey: this.apiKey,
      data: {
        order_identifier: this.orderIdentifier,
      },
    });
    $.export("$summary", `Successfully retrieved status for automation order ${this.orderIdentifier}`);
    return response;
  },
};
