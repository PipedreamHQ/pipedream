import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-customer",
  name: "Update Customer",
  description:
    "Update an existing customer's details in Shopify."
    + " Use when an agent needs to change a customer's name, email, phone, or address."
    + " Use **Search for Customers** to find the customer by email, name, or tag — or **Get Customers** to browse all customers — then pass the customer `id` here."
    + " Returns the updated customer object including `id`, `email`, `firstName`, and `lastName`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerupdate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
      description: "The GID of the customer to update. Example: `gid://shopify/Customer/123456789`. Use **Search for Customers** or **Get Customers** to find customer IDs.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Updated first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Updated last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Updated email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Updated phone number in E.164 format. Example: `+15555551234`",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Updated street address",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Updated company name",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Updated city",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province/State",
      description: "Updated province or state",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Updated country code. Example: `US`",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP/Postal Code",
      description: "Updated ZIP or postal code",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasAddress = this.address || this.city || this.country;
    const response = await this.shopify.updateCustomer({
      input: {
        id: this.customerId,
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
    if (response.customerUpdate.userErrors.length > 0) {
      throw new Error(response.customerUpdate.userErrors[0].message);
    }
    $.export("$summary", `Successfully updated customer \`${response.customerUpdate.customer.email ?? response.customerUpdate.customer.id}\``);
    return response.customerUpdate.customer;
  },
};
