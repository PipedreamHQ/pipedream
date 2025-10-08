import clearBooks from "../../clear_books.app.mjs";

export default {
  key: "clear_books-create-supplier",
  name: "Create Supplier",
  description: "Creates a new supplier in Clear Books. [See the documentation](https://u.pcloud.link/publink/show?code=XZkThJ5Z4zKewgCL6VBpfxlPeHPDdXXj0Cc7)",
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
      description: "Name of the supplier",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the supplier",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the supplier",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Street address of the supplier",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "Town of the supplier",
      optional: true,
    },
    county: {
      type: "string",
      label: "County",
      description: "County of the supplier",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "Postcode of the supplier",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Country code of the supplier",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasAddress = this.streetAddress
      || this.town
      || this.county
      || this.postcode
      || this.countryCode;

    const response = await this.clearBooks.createSupplier({
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
    $.export("$summary", `Successfully created supplier with ID: ${response.id}`);
    return response;
  },
};
