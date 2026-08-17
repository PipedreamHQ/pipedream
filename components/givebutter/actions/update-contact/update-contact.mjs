// x-pd-ai: optimized
import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-update-contact",
  name: "Update Contact",
  description: "Update an existing Givebutter contact, returning the updated contact object. Use **List Contacts** first to find the contact ID. Only the fields you provide are changed. [See the documentation](https://docs.givebutter.com/api-reference/contacts/update-a-contact)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to update (an integer identifier, e.g. `12345`). Run **List Contacts** to find valid contact IDs.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Updated first name (max 255 chars). Maps to the API `first_name` field.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Updated last name (max 255 chars). Maps to the API `last_name` field.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Updated primary email address. Submitted to Givebutter as the `primary_email` field. Example: `jane.updated@example.com`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Updated primary phone number. Maps to the API `primary_phone` field. Example: `+15555550100`.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Updated company name (max 255 chars). Maps to the API `company_name` field.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note to set on the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional list of tag strings to set on the contact (max 64 tags). Example: `[\"vip\", \"newsletter\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const contact = await this.givebutter.updateContact({
      $,
      contactId: this.contactId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        primary_email: this.email,
        primary_phone: this.phone,
        company_name: this.companyName,
        note: this.note,
        tags: this.tags,
      },
    });
    $.export("$summary", `Updated contact ${contact?.id ?? this.contactId}`);
    return contact;
  },
};
