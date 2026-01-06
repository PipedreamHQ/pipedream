import chargekeep from "../../chargekeep.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "chargekeep-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Create or update a contact in Chargekeep. [See the documentation](https://crm.chargekeep.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    chargekeep,
    contactGroupId: {
      propDefinition: [
        chargekeep,
        "contactGroupId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "The street address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
    links: {
      type: "string[]",
      label: "Links",
      description: "An array of URLs to the contact's links",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.firstName
      && !this.lastName
      && !this.companyName
      && !this.emailAddress
      && !this.phoneNumber
    ) {
      throw new ConfigurationError("At least one of First Name, Last Name, Company Name, Email Address, or Phone Number must be provided.");
    }

    const hasAddress = this.streetAddress
      || this.city
      || this.state
      || this.postalCode
      || this.country;

    const response = await this.chargekeep.createOrUpdateContact({
      $,
      data: {
        matchExisting: true,
        contactGroupId: this.contactGroupId,
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        emailAddresses: this.emailAddress
          ? [
            {
              emailAddress: this.emailAddress,
            },
          ]
          : undefined,
        phoneNumbers: this.phoneNumber
          ? [
            {
              phoneNumber: this.phoneNumber,
            },
          ]
          : undefined,
        addresses: hasAddress
          ? [
            {
              streetAddress: this.streetAddress,
              city: this.city,
              stateName: this.state,
              zip: this.postalCode,
              countryName: this.country,
            },
          ]
          : undefined,
        links: this.links?.length
          ? this.links.map((link) => ({
            url: link,
          }))
          : undefined,
      },
    });

    if (response.result?.contactId) {
      $.export("$summary", `Successfully created or updated contact with ID ${response.result.contactId}.`);
    }
    return response;
  },
};
