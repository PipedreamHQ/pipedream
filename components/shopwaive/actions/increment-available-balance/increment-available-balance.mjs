import shopwaive from "../../shopwaive.app.mjs";

export default {
  key: "shopwaive-increment-available-balance",
  name: "Increment Available Balance",
  description: "Increases the available balance of a specific customer by a supplied value.",
  version: "0.0.${ts}",
  type: "action",
  props: {
    shopwaive,
    customerId: shopwaive.propDefinitions.customerId,
    balanceIncrement: shopwaive.propDefinitions.balanceIncrement,
  },
  async run({ $ }) {
    const response = await this.shopwaive.increaseCustomerBalance({
      customerId: this.customerId,
      balanceIncrement: this.balanceIncrement,
    });
    $.export("$summary", `Successfully incremented balance for customer ID ${this.customerId}`);
    return response;
  },
};
