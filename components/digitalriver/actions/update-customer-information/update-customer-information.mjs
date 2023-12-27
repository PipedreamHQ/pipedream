import digitalriver from "../../digitalriver.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "digitalriver-update-customer-information",
  name: "Update Customer Information",
  description: "Updates the information for a customer in Digital River. [See the documentation](https://www.digitalriver.com/docs/digital-river-api-reference/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    digitalriver,
    contactId: {
      propDefinition: [
        digitalriver,
        "contactId",
        async (opts) => ({
          contactId: opts.prevContext.contactId,
        }),
      ],
    },
    customerData: {
      propDefinition: [
        digitalriver,
        "customerData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.digitalriver.updateCustomer({
      contactId: this.contactId,
      customerData: this.customerData,
    });

    $.export("$summary", `Updated customer information for contact ID ${this.contactId}`);
    return response;
  },
};
