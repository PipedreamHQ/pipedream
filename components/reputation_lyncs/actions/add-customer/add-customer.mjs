import reputationLyncs from "../../reputation_lyncs.app.mjs";

export default {
  key: "reputation_lyncs-add-customer",
  name: "Add Customer",
  description: "Adds a new customer to the Reputation Lyncs platform. Requires the customer's full name. Optionally, an email and a phone number can be provided.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    reputationLyncs,
    fullName: reputationLyncs.propDefinitions.fullName,
    email: {
      ...reputationLyncs.propDefinitions.email,
      optional: true,
    },
    phone: {
      ...reputationLyncs.propDefinitions.phone,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.reputationLyncs.addCustomer({
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
    });

    $.export("$summary", `Successfully added new customer: ${this.fullName}`);
    return response;
  },
};
