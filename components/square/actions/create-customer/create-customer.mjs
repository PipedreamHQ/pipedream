import square from "../../square.app.mjs";

export default {
  key: "square-create-customer",
  name: "Create Customer",
  description: `Creates a new customer for a business. Must provide at least one of the following:
    Given Name, Family Name, Company Name, Email Address, or Phone Number. [See the docs](https://developer.squareup.com/reference/square/customers-api/create-customer).`,
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    square,
    givenName: {
      type: "string",
      label: "Given Name",
      description: "The first name associated with the customer profile",
      optional: true,
    },
    familyName: {
      type: "string",
      label: "Family Name",
      description: "The last name associated with the customer profile",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "A business name associated with the customer profile",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address associated with the customer profile",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Must be a valid phone number and can contain 9-16 digits, with an optional + prefix and country code",
      optional: true,
    },
    referenceId: {
      propDefinition: [
        square,
        "referenceId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "A custom note associated with the customer profile",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.square.createCustomer({
      $,
      generateIdempotencyKey: true,
      data: {
        given_name: this.givenName,
        family_name: this.familyName,
        company_name: this.companyName,
        email_address: this.email,
        phone_number: this.phoneNumber,
        reference_id: this.referenceId,
        note: this.note,
      },
    });
    $.export("$summary", "Successfully created customer");
    return response;
  },
};
