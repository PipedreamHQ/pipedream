import shopwaive from "../../shopwaive.app.mjs";

export default {
  key: "shopwaive-get-available-balance",
  name: "Get Available Balance",
  description: "Fetches the current available balance of a selected customer based on provided customer ID. [See the documentation](https://api.shopwaive.com/reference/rest-api-documentation/customer-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shopwaive,
    customerId: shopwaive.propDefinitions.customerId,
  },
  async run({ $ }) {
    const response = await this.shopwaive.fetchCustomerBalance({
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully fetched the available balance for customer ID ${this.customerId}`);
    return response;
  },
};
