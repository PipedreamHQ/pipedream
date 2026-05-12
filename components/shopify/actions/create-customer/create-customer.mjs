import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-customer",
  name: "Create Customer",
  description:
    "Create a new customer in Shopify."
    + " Use when an agent needs to onboard a new buyer, add a contact, or register a customer account."
    + " Either **Email** or **Phone** is required by Shopify."
    + " To update an existing customer, use **Update Customer** instead."
    + " Returns the new customer object including `id`, `email`, `phone`, `firstName`, and `lastName`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customercreate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has customer data properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The customer's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The customer's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The customer's email address. Either email or phone is required.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The customer's phone number in E.164 format. Example: `+15555551234`",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Street address for the customer's default address",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company the customer is associated with",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City for the customer's default address",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province/State",
      description: "Province or state for the customer's default address",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code for the customer's default address. Example: `US`",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP/Postal Code",
      description: "ZIP or postal code for the customer's default address",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasAddress = this.address || this.city || this.country;
    const response = await this.shopify.createCustomer({
      input: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        addresses: hasAddress
          ? [
            {
              address1: this.address,
              company: this.company,
              city: this.city,
              province: this.province,
              country: this.country,
              zip: this.zip,
            },
          ]
          : undefined,
      },
    });
    if (response.customerCreate.userErrors.length > 0) {
      throw new Error(response.customerCreate.userErrors[0].message);
    }
    $.export("$summary", `Successfully created customer \`${response.customerCreate.customer.id}\``);
    return response.customerCreate.customer;
  },
};
