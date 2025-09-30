import shopwaive from "../../shopwaive.app.mjs";

export default {
  key: "shopwaive-get-available-balance",
  name: "Get Available Balance",
  description: "Fetches the current available balance of a customer. [See the documentation](https://api.shopwaive.com/reference/rest-api-documentation/customer-api#get-customer-account-balance-and-transactions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopwaive,
    customerEmail: {
      propDefinition: [
        shopwaive,
        "customerEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopwaive.fetchCustomerBalance({
      $,
      customerEmail: this.customerEmail,
    });
    $.export("$summary", `Successfully fetched data for ${this.customerEmail}`);
    return response;
  },
};
