import clearBooks from "../../clear_books.app.mjs";

export default {
  key: "clear_books-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Clear Books. [See the documentation](https://u.pcloud.link/publink/show?code=XZkThJ5Z4zKewgCL6VBpfxlPeHPDdXXj0Cc7)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clearBooks,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Street address of the customer",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "Town of the customer",
      optional: true,
    },
    county: {
      type: "string",
      label: "County",
      description: "County of the customer",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "Postcode of the customer",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Country code of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasAddress = this.streetAddress
      || this.town
      || this.county
      || this.postcode
      || this.countryCode;

    const response = await this.clearBooks.createCustomer({
      $,
      data: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        address: hasAddress && {
          line1: this.streetAddress,
          town: this.town,
          county: this.county,
          postcode: this.postcode,
          countryCode: this.countryCode,
        },
      },
    });
    $.export("$summary", `Successfully created customer with ID: ${response.id}`);
    return response;
  },
};
