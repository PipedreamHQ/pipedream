import shopwaive from "../../shopwaive.app.mjs";

export default {
  key: "shopwaive-set-available-balance",
  name: "Set Available Balance",
  description: "Updates the available balance of a named customer to an exact value. [See the documentation](https://api.shopwaive.com/reference/rest-api-documentation/customer-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shopwaive,
    customerId: shopwaive.propDefinitions.customerId,
    newBalance: shopwaive.propDefinitions.newBalance,
  },
  async run({ $ }) {
    const response = await this.shopwaive.updateCustomerBalance({
      customerId: this.customerId,
      newBalance: this.newBalance,
    });

    $.export("$summary", `Successfully set the available balance for customer ID ${this.customerId}`);
    return response;
  },
};
