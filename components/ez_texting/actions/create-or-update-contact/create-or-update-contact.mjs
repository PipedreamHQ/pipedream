import app from "../../ez_texting.app.mjs";

export default {
  key: "ez_texting-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Create a contact, or update the existing contact with the same phone number. **Group IDs to Add** and **Group IDs to Remove** change which contact groups the contact belongs to, leaving any group named in neither untouched. [See the documentation](https://developers.eztexting.com/reference/createorupdate-1)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      description: "The contact's phone number, e.g. `5551234567`. An existing contact with this number is updated rather than duplicated.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name. Max 20 characters.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name. Max 20 characters.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Notes about the contact. Max 200 characters.",
      optional: true,
    },
    custom1: {
      type: "string",
      label: "Custom Value 1",
      description: "Custom value 1. Max 20 characters.",
      optional: true,
    },
    custom2: {
      type: "string",
      label: "Custom Value 2",
      description: "Custom value 2. Max 20 characters.",
      optional: true,
    },
    custom3: {
      type: "string",
      label: "Custom Value 3",
      description: "Custom value 3. Max 20 characters.",
      optional: true,
    },
    custom4: {
      type: "string",
      label: "Custom Value 4",
      description: "Custom value 4. Max 20 characters.",
      optional: true,
    },
    custom5: {
      type: "string",
      label: "Custom Value 5",
      description: "Custom value 5. Max 20 characters.",
      optional: true,
    },
    values: {
      type: "object",
      label: "Custom Fields",
      description: "Additional custom fields, keyed by contact field name. **Example:** `{\"survey_wave\": \"2026-Q3\"}`",
      optional: true,
    },
    groupIdsAdd: {
      propDefinition: [
        app,
        "groupIds",
      ],
      label: "Group IDs to Add",
      description: "Groups to add this contact to.",
    },
    groupIdsRemove: {
      propDefinition: [
        app,
        "groupIds",
      ],
      label: "Group IDs to Remove",
      description: "Groups to remove this contact from.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrUpdateContact({
      $,
      data: {
        phoneNumber: this.phoneNumber,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        note: this.note,
        custom1: this.custom1,
        custom2: this.custom2,
        custom3: this.custom3,
        custom4: this.custom4,
        custom5: this.custom5,
        values: this.values,
        groupIdsAdd: this.groupIdsAdd,
        groupIdsRemove: this.groupIdsRemove,
      },
    });

    $.export("$summary", `Successfully saved contact ${this.phoneNumber}`);

    return response;
  },
};
