import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-create-subscription",
  name: "Create Subscription",
  description: "Creates a new subscription allowing a customer to subscribe to a product. [See the documentation](https://developer.recharge.com/reference#post_create-a-subscription)",
  version: "0.0.1",
  type: "action",
  props: {
    recharge,
    customerId: recharge.propDefinitions.customerId,
    productId: recharge.propDefinitions.productId,
    addressId: {
      ...recharge.propDefinitions.addressId,
      optional: true,
    },
    discountId: {
      ...recharge.propDefinitions.discountId,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.recharge.createSubscription({
      customerId: this.customerId,
      productId: this.productId,
      addressId: this.addressId,
      discountId: this.discountId,
    });

    $.export("$summary", `Successfully created a new subscription with ID ${response.id}`);
    return response;
  },
};
