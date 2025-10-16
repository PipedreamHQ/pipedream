import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Altoviz. [See the documentation](https://developer.altoviz.com/api#tag/Customers/operation/POST_Customers_Post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    altoviz,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the customer",
    },
    number: {
      type: "string",
      label: "Number",
      description: "The customer number",
    },
    billingAddressStreet: {
      type: "string",
      label: "Billing Address - Street",
      description: "Street of the billing address of the customer",
      optional: true,
    },
    billingAddressCity: {
      type: "string",
      label: "Billing Address - City",
      description: "City of the billing address of the customer",
      optional: true,
    },
    billingAddressZipCode: {
      type: "string",
      label: "Billing Address - Zip Code",
      description: "Zip Code of the billing address of the customer",
      optional: true,
    },
    billingAddressCountry: {
      type: "string",
      label: "Billing Address - Country",
      description: "Country of the billing address of the customer",
      optional: true,
    },
    shippingAddressStreet: {
      type: "string",
      label: "Shipping Address - Street",
      description: "Street of the shipping address of the customer",
      optional: true,
    },
    shippingAddressCity: {
      type: "string",
      label: "Shipping Address - City",
      description: "City of the shipping address of the customer",
      optional: true,
    },
    shippingAddressZipCode: {
      type: "string",
      label: "Shipping Address - Zip Code",
      description: "Zip Code of the shipping address of the customer",
      optional: true,
    },
    shippingAddressCountry: {
      type: "string",
      label: "Shipping Address - Country",
      description: "Country of the shipping address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.altoviz.createCustomer({
      $,
      data: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        number: this.number,
        billingAddress: {
          street: this.billingAddressStreet,
          city: this.billingAddressCity,
          zipcode: this.billingAddressZipCode,
          countryIso: this.billingAddressCountry,
        },
        shippingAddress: {
          street: this.shippingAddressStreet,
          city: this.shippingAddressCity,
          zipcode: this.shippingAddressZipCode,
          countryIso: this.shippingAddressCountry,
        },
        phone: this.phone,
      },
    });
    $.export("$summary", `Successfully created customer with ID: ${response.id}`);
    return response;
  },
};
