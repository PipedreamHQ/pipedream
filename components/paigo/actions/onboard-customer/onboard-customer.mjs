import paigo from "../../paigo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "paigo-onboard-customer",
  name: "Onboard Customer",
  description: "Creates a new customer and assigns them an offering in Paigo. [See the documentation](http://www.api.docs.paigo.tech/#tag/Customers/operation/Create%20a%20customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paigo,
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The friendly, human-readable name for the customer profile",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer email address",
    },
    paymentChannel: {
      type: "string",
      label: "Payment Channel",
      description: "The payment channel associated with a customer",
      options: constants.PAYMENT_CHANNELS,
    },
    offeringId: {
      propDefinition: [
        paigo,
        "offeringId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paigo.createCustomer({
      $,
      data: {
        customerName: this.customerName,
        email: this.email,
        paymentChannel: this.paymentChannel,
        offeringId: this.offeringId,
      },
    });
    $.export("$summary", `Successfully onboarded customer with ID ${response.customerId}`);
    return response;
  },
};
