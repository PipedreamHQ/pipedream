import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-fetch-customer",
  name: "Fetch Customer",
  description: "Get details of a customer on your integration. [See the documentation](https://paystack.com/docs/api/customer/#fetch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    paystack,
    customerCode: {
      propDefinition: [
        paystack,
        "customerCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.fetchCustomer({
      $,
      customer: this.customerCode,
    });

    $.export("$summary", `Successfully fetched customer ${this.customerCode}`);
    return response;
  },
};
