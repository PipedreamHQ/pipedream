import chaser from "../../chaser.app.mjs";

export default {
  key: "chaser-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Chaser. [See the documentation](https://openapi.chaserhq.com/docs/static/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    chaser,
    customerDetails: {
      propDefinition: [
        chaser,
        "customerDetails",
      ],
    },
    associatedContactDetails: {
      propDefinition: [
        chaser,
        "associatedContactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chaser.createCustomer({
      customerDetails: this.customerDetails,
      associatedContactDetails: this.associatedContactDetails,
    });
    $.export("$summary", `Successfully created customer with ID ${response.id}`);
    return response;
  },
};
