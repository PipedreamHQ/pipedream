import vivocalendar from "../../vivocalendar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivocalendar-create-customer",
  name: "Create Customer",
  description: "Adds a new customer to VIVOcalendar. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vivocalendar,
    customerName: {
      propDefinition: [
        vivocalendar,
        "customerName",
      ],
    },
    customerEmail: {
      propDefinition: [
        vivocalendar,
        "customerEmail",
      ],
    },
    customerPhoneNumber: {
      propDefinition: [
        vivocalendar,
        "customerPhoneNumber",
        (c) => ({
          optional: true,
        }), // Marking it as optional as per the requirements
      ],
      optional: true,
    },
    customerAddress: {
      propDefinition: [
        vivocalendar,
        "customerAddress",
        (c) => ({
          optional: true,
        }), // Marking it as optional as per the requirements
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vivocalendar.createCustomer({
      customerName: this.customerName,
      customerContact: this.customerEmail, // Assuming customerContact should be the email as per the mandatory props
      customerEmail: this.customerEmail,
      customerPhoneNumber: this.customerPhoneNumber,
      customerAddress: this.customerAddress,
    });

    $.export("$summary", `Successfully added new customer ${this.customerName}`);
    return response;
  },
};
