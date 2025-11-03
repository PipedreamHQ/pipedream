import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-add-or-update-contact",
  name: "Add or Update Contact",
  description: "Adds or updates a contact. [See the docs here](https://docs.sendgrid.com/api-reference/contacts/add-or-update-a-contact)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    listIds: {
      propDefinition: [
        common.props.sendgrid,
        "listIds",
      ],
    },
    email: {
      propDefinition: [
        common.props.sendgrid,
        "contactEmail",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's personal name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's family name",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the address",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "An optional second line for the address",
      optional: true,
    },
    alternateEmails: {
      type: "string[]",
      label: "Alternate Emails",
      description: "Additional emails associated with the contact",
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
        "The contact's country. Can be a full name or an abbreviation",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The contact's ZIP code or other postal code",
      optional: true,
    },
    stateProvinceRegion: {
      type: "string",
      label: "State Province Region",
      description: "The contact's state, province, or region",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the contact",
      optional: true,
    },
  },
  async run({ $ }) {
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
    const config = this.omitEmptyStringValues({
      list_ids: this.listIds,
      contacts,
    });
    const resp = await this.sendgrid.addOrUpdateContacts(config);
    $.export("$summary", "Successfully added/updated contact");
    return resp;
  },
};
