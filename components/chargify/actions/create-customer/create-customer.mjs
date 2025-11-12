import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Chargify. [See the documentation](https://developers.maxio.com/http/advanced-billing-api/api-endpoints/customers/create-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chargify,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization of the customer",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "Street address of the customer (line 1)",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Street Address (line 2)",
      description: "Street address of the customer (line 2)",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the customer",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State/Region of the customer",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the customer",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country code of the customer. Example: `US`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
    taxExempt: {
      type: "boolean",
      label: "Tax Exempt",
      description: "Set to `true` if the customer is tax exempt.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { customer } = await this.chargify.createCustomer({
      $,
      data: {
        customer: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          organization: this.organization,
          address: this.address,
          address_2: this.address2,
          city: this.city,
          state: this.state,
          zip: this.zip,
          country: this.country,
          phone: this.phone,
          tax_exempt: this.taxExempt,
        },
      },
    });
    $.export("$summary", `Successfully created customer with ID ${customer.id}`);
    return customer;
  },
};
