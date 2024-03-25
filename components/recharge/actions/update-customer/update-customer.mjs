import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer's details in ReCharge.",
  version: "0.0.1",
  type: "action",
  props: {
    recharge,
    customerId: recharge.propDefinitions.customerId,
    name: recharge.propDefinitions.name,
    email: recharge.propDefinitions.email,
    addressId: recharge.propDefinitions.addressId,
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      email: this.email,
      address_id: this.addressId,
    };

    // Filter out undefined properties
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const response = await this.recharge.updateCustomer({
      customerId: this.customerId,
      ...data,
    });

    $.export("$summary", `Successfully updated customer ${this.customerId}`);
    return response;
  },
};
