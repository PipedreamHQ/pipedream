// x-pd-ai: optimized
import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-create-contact",
  name: "Create Contact",
  description: "Create a new contact/donor in Givebutter. Calls POST /contacts and returns the created contact with its assigned `id`. For an individual contact, provide `firstName` and `lastName`; the `email` value is submitted as the API `primary_email` field. [See the documentation](https://docs.givebutter.com/api-reference/contacts/create-a-contact)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name (max 255 chars). Required for individual contacts. Maps to the API `first_name` field.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name (max 255 chars). Required for individual contacts. Maps to the API `last_name` field.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's primary email address. Submitted to Givebutter as the `primary_email` field. Example: `jane@example.com`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's primary phone number. Maps to the API `primary_phone` field. Example: `+15555550100`.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Contact type. One of: `individual`, `company`. For `company`, provide `companyName` instead of first/last name.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name (max 255 chars). Required when `type` is `company`. Maps to the API `company_name` field.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional list of tag strings to attach to the contact (max 64 tags). Example: `[\"vip\", \"newsletter\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const contact = await this.givebutter.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        primary_email: this.email,
        primary_phone: this.phone,
        type: this.type,
        company_name: this.companyName,
        tags: this.tags,
      },
    });
    $.export("$summary", `Created contact ${contact?.id} - ${contact?.first_name ?? ""} ${contact?.last_name ?? ""}`.trim());
    return contact;
  },
};
