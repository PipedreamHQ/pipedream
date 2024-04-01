import paigo from "../../paigo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "paigo-onboard-customer",
  name: "Onboard Customer",
  description: "Creates a new customer and assigns them an offering in Paigo. Returns the details of the customer and the associated offering.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paigo,
    offeringId: {
      type: "string",
      label: "Offering ID",
      description: "The unique identifier for the offering to be assigned to the customer",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The details for the new customer",
    },
  },
  async run({ $ }) {
    const customer = await this.paigo.createCustomer(this.customerDetails);
    const offering = await this.paigo.assignOfferingToCustomer(this.offeringId, customer.id);
    $.export("$summary", `Successfully onboarded customer with ID ${customer.id} and assigned offering with ID ${offering.id}`);
    return {
      customer,
      offering,
    };
  },
};
