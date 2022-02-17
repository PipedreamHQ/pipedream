const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-add-or-update-contact",
  name: "Add Or Update Contact",
  description: "Adds or updates a contact.",
  version: "0.0.35",
  type: "action",
  props: {
    ...common.props,
    listIds: {
      type: "string[]",
      label: "List Ids",
      description:
        "A string array of List IDs where the contact will be added to. Example:  `[\"49eeb4d9-0065-4f6a-a7d8-dfd039b77e0f\",\"89876b28-a90e-41d1-b73b-e4a6ce2354ba\"]`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's personal name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's family name.",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the address.",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "An optional second line for the address.",
      optional: true,
    },
    alternateEmails: {
      type: "string[]",
      label: "Alternate Emails",
      description: "Additional emails associated with the contact.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The contact's city.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description:
        "The contact's country. Can be a full name or an abbreviation.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The contact's ZIP code or other postal code.",
      optional: true,
    },
    stateProvinceRegion: {
      type: "string",
      label: "State Province Region",
      description: "The contact's state, province, or region.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the contact.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    validate.validators.arrayValidator = this.validateArray;
    const constraints = {
      email: {
        presence: true,
        email: true,
      },
    };
    if (this.listIds) {
      constraints.listIds = {
        type: "array",
      };
    }
    if (this.alternateEmails) {
      constraints.cc = {
        type: "array",
      };
    }
    const validationResult = validate(
      {
        email: this.email,
        listIds: this.listIds,
        alternateEmails: this.alternateEmails,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const contacts = [
      {
        email: this.email,
        address_line_1: this.addressLine1,
        address_line_2: this.addressLine2,
        alternate_emails: this.alternateEmails,
        city: this.city,
        country: this.country,
        first_name: this.firstName,
        last_name: this.lastName,
        postal_code: this.postalCode,
        state_province_region: this.stateProvinceRegion,
        custom_fields: this.customFields,
      },
    ];
    const config = {
      list_ids: this.convertEmptyStringToUndefined(this.listIds),
      contacts,
    };
    return this.sendgrid.addOrUpdateContacts(config);
  },
};
