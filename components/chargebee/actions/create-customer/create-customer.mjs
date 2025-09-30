import chargebee from "../../chargebee.app.mjs";
import { clearObject } from "../../common/utils.mjs";

export default {
  key: "chargebee-create-customer",
  name: "Create Customer",
  description: "Create a customer in Chargebee. [See the documentation](https://apidocs.chargebee.com/docs/api/customers?lang=node-v3#create_a_customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chargebee,
    id: {
      type: "string",
      label: "ID",
      description: "ID for the new customer. If not given, this will be auto-generated.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the customer.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the customer.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company name of the customer.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields and values to set for the customer. [See the documentation](https://apidocs.chargebee.com/docs/api/customers?lang=curl#create_a_customer) for all available fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chargebee.createCustomer(clearObject({
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      company: this.company,
      ...this.additionalFields,
    }));

    $.export("$summary", `Successfully created customer (ID: ${response?.customer?.id})`);
    return response?.customer ?? response;
  },
};
