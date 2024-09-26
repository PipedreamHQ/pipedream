import { TIMEZONE_OPTIONS } from "../../common/constants.mjs";
import pidj from "../../pidj.app.mjs";

export default {
  key: "pidj-create-contact",
  name: "Create Contact",
  description: "Initiates a process to add a new contact to your Pidj account. [See the documentation](https://pidj.co/wp-content/uploads/2023/06/Pidj-API-Technical-Document-v3-1.pdf).",
  version: "0.0.1",
  type: "action",
  props: {
    pidj,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number for the contact. This must be in E.164 format. **e.g., +18885552222**",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The contact's email address.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The contact's business name.",
      optional: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The contact's display name, if present, and different from first and last name.",
      optional: true,
    },
    groupId: {
      propDefinition: [
        pidj,
        "groupId",
      ],
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone identifier for the contact. If omitted, this will default to the account value.",
      options: TIMEZONE_OPTIONS,
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "The external ID of the contact from your own system. This may be used in any enabled integrations to cross-identify the contact record.",
      optional: true,
    },
    homeAddressStreet1: {
      type: "string",
      label: "Home Street 1",
      description: "The home street address 1.",
      optional: true,
    },
    homeAddressStreet2: {
      type: "string",
      label: "Home Street 2",
      description: "The home street address 2.",
      optional: true,
    },
    homeAddressCity: {
      type: "string",
      label: "Home City",
      description: "The home city address.",
      optional: true,
    },
    homeAddressState: {
      type: "string",
      label: "Home State",
      description: "The home state address. Must be the standard 2 character abbreviation (**ANSI2-letter** or **USPS**). Any other values will be discarded. [See further information](https://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations).",
      optional: true,
    },
    homeAddressPostal: {
      type: "string",
      label: "Home Postal",
      description: "Valid 5 or 10 digit zipcode (US addresses). British, Canadian, and Australian postal codes also supported.",
      optional: true,
    },
    homeAddressCountry: {
      type: "string",
      label: "Home Country",
      description: "Must be either **ISO 3166-1 alpha-2** or **ISO 3166-1 alpha-3**. Any other values will be discarded. [See further information](https://en.wikipedia.org/wiki/ISO_3166-1).",
      optional: true,
    },
    businessAddressStreet1: {
      type: "string",
      label: "Business Street 1",
      description: "The business street address 1.",
      optional: true,
    },
    businessAddressStreet2: {
      type: "string",
      label: "Business Street 2",
      description: "The business street address 2.",
      optional: true,
    },
    businessAddressCity: {
      type: "string",
      label: "Business City",
      description: "The business city address.",
      optional: true,
    },
    businessAddressState: {
      type: "string",
      label: "Business State",
      description: "The business state address. Must be the standard 2 character abbreviation (**ANSI2-letter** or **USPS**). Any other values will be discarded. [See further information](https://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations).",
      optional: true,
    },
    businessAddressPostal: {
      type: "string",
      label: "Business Postal",
      description: "Valid 5 or 10 digit zipcode (US addresses). British, Canadian, and Australian postal codes also supported.",
      optional: true,
    },
    businessAddressCountry: {
      type: "string",
      label: "Business Country",
      description: "Must be either **ISO 3166-1 alpha-2** or **ISO 3166-1 alpha-3**. Any other values will be discarded. [See further information](https://en.wikipedia.org/wiki/ISO_3166-1).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pidj.addContact({
      $,
      data: {
        phone_number: this.phoneNumber,
        email_address: this.emailAddress,
        first_name: this.firstName,
        last_name: this.lastName,
        business_name: this.businessName,
        display_name: this.displayName,
        group: this.groupId,
        timezone: this.timezone,
        external_id: this.externalId,
        addresses: {
          home_street_1: this.homeAddressStreet1,
          home_street_2: this.homeAddressStreet2,
          home_city: this.homeAddressCity,
          home_state: this.homeAddressState,
          home_postal: this.homeAddressPostal,
          home_country: this.homeAddressCountry,
          business_street_1: this.businessAddressStreet1,
          business_street_2: this.businessAddressStreet2,
          business_city: this.businessAddressCity,
          business_state: this.businessAddressState,
          business_postal: this.businessAddressPostal,
          business_country: this.businessAddressCountry,
        },
      },
    });
    $.export("$summary", `Successfully added a new contact with Id: ${response.id}`);
    return response;
  },
};
