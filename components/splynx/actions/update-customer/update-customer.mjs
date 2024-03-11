import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-update-customer",
  name: "Update Customer",
  description: "Updates information of an existing customer. The updated fields are sent as props. It requires the specific customer ID to successfully carry out this action. [See the documentation](https://splynx.docs.apiary.io/)",
  version: "0.0.1",
  type: "action",
  props: {
    splynx,
    customerId: splynx.propDefinitions.customerId,
    personalInformation: splynx.propDefinitions.personalInformation,
    contactDetails: splynx.propDefinitions.contactDetails,
    serviceDetails: splynx.propDefinitions.serviceDetails,
    specialConditions: splynx.propDefinitions.specialConditions,
  },
  async run({ $ }) {
    const updatedFields = {
      personalInformation: this.personalInformation,
      contactDetails: this.contactDetails,
      serviceDetails: this.serviceDetails,
      specialConditions: this.specialConditions,
    };

    const response = await this.splynx.updateCustomer({
      customerId: this.customerId,
      updatedFields,
    });

    $.export("$summary", `Successfully updated customer with ID ${this.customerId}`);
    return response;
  },
};
