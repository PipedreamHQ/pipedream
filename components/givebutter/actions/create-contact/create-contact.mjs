// x-pd-ai: optimized
import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-create-contact",
  name: "Create Contact",
  description: "Create a new contact/donor in Givebutter, returning the created contact with its assigned `id`. For an individual contact, provide `firstName` and `lastName`; the `email` value is submitted as the API `primary_email` field. [See the documentation](https://docs.givebutter.com/api-reference/contacts/create-a-contact)",
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
      propDefinition: [
        givebutter,
        "firstName",
      ],
      description: "Contact's first name (max 255 chars). For an individual contact without email or phone, provide both first and last names. Maps to the API `first_name` field.",
    },
    lastName: {
      propDefinition: [
        givebutter,
        "lastName",
      ],
      description: "Contact's last name (max 255 chars). Maps to the API `last_name` field.",
    },
    email: {
      propDefinition: [
        givebutter,
        "email",
      ],
      description: "Contact's primary email address. Submitted to Givebutter as the `primary_email` field. Example: `jane@example.com`.",
    },
    phone: {
      propDefinition: [
        givebutter,
        "phone",
      ],
      description: "Contact's primary phone number. Maps to the API `primary_phone` field. Example: `+15555550100`.",
    },
    type: {
      propDefinition: [
        givebutter,
        "contactType",
      ],
      description: "Type of contact to create. For `company`, provide **Company Name** instead of first/last name.",
    },
    companyName: {
      propDefinition: [
        givebutter,
        "companyName",
      ],
      description: "Company name (max 255 chars). Required when **Type** is `company`. Maps to the API `company_name` field.",
    },
    tags: {
      propDefinition: [
        givebutter,
        "tags",
      ],
      description: "Optional list of tag strings to attach to the contact (max 64 tags). Example: `[\"vip\", \"newsletter\"]`.",
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
