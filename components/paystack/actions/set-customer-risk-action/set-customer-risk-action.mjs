import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-set-customer-risk-action",
  name: "Set Customer Risk Action",
  description: "Whitelist or blacklist a customer on your integration. [See the documentation](https://paystack.com/docs/api/customer/#whitelist-blacklist)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    paystack,
    customerCode: {
      propDefinition: [
        paystack,
        "customerCode",
      ],
    },
    riskAction: {
      propDefinition: [
        paystack,
        "riskAction",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.setCustomerRiskAction({
      $,
      data: {
        customer: this.customerCode,
        risk_action: this.riskAction,
      },
    });

    $.export("$summary", `Successfully set risk action to "${this.riskAction}" for customer ${this.customerCode}`);
    return response;
  },
};
