import { ConfigurationError } from "@pipedream/platform";
import thebookie from "../../the_bookie.app.mjs";

export default {
  key: "the_bookie-create-contact",
  name: "Create Contact",
  description: "Instantly creates a new contact in the address book. [See the documentation](https://app.thebookie.nl/nl/help/article/api-documentatie/#contact_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thebookie,
    organisationName: {
      type: "string",
      label: "Organisation Name",
      description: "The contact's organization name",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The contact's address street",
      optional: true,
    },
    streetNumber: {
      type: "string",
      label: "Street Number",
      description: "The contact's address number",
      optional: true,
    },
    streetNumberAddition: {
      type: "string",
      label: "Street Number Addition",
      description: "The contact's address number addition",
      optional: true,
    },
    extraAddressLine: {
      type: "string",
      label: "Extra Address Line",
      description: "The contact's extra address line",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The contact's address postal code",
      optional: true,
    },
    town: {
      type: "string",
      label: "Town",
      description: "The contact's city",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The contact's country",
      optional: true,
    },
    isSupplier: {
      type: "boolean",
      label: "Is Supplier",
      description: "Whether the contact is supplier or not",
      optional: true,
    },
    isClient: {
      type: "boolean",
      label: "Is Client",
      description: "Whether the contact is client or not",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
      optional: true,
    },
    telephoneNumber: {
      type: "string",
      label: "Telephone Number",
      description: "The contact's telephone number",
      optional: true,
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "The contact's mobile number",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    extraInfo: {
      type: "string",
      label: "Extra Info",
      description: "An additional info",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.isClient && !this.isSupplier) {
      throw new ConfigurationError("'Is Supplier' or 'Is Client' must be true (or both)");
    }

    const response = await this.thebookie.createContact({
      $,
      data: {
        organisation_name: this.organisationName,
        street: this.street,
        street_number: this.streetNumber,
        street_number_addition: this.streetNumberAddition,
        extra_address_line: this.extraAddressLine,
        postal_code: this.postalCode,
        town: this.town,
        country: this.country,
        is_supplier: this.isSupplier,
        is_client: this.isClient,
        email: this.email,
        telephone_number: this.telephoneNumber,
        mobile_number: this.mobileNumber,
        first_name: this.firstName,
        last_name: this.lastName,
        extra_info: this.extraInfo,
      },
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}`);

    return response;
  },
};
