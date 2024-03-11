import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-create-customer",
  name: "Create Customer",
  description: "Creates a new customer with provided details including personal information and contact details. Unique identification details and contact information are required.",
  version: "0.0.1",
  type: "action",
  props: {
    splynx,
    personalInformation: splynx.propDefinitions.personalInformation,
    contactDetails: splynx.propDefinitions.contactDetails,
  },
  async run({ $ }) {
    const response = await this.splynx.createCustomer({
      personalInformation: this.personalInformation,
      contactDetails: this.contactDetails,
    });
    $.export("$summary", `Successfully created customer with ID: ${response.id}`);
    return response;
  },
};
