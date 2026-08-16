import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-update-contact",
  name: "Update Contact",
  description: "Update an existing contact's fields in Instant Reply. Use this to sync CRM updates, tag changes, or enriched data back into your inbox. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    contactId: {
      propDefinition: [
        instantReply,
        "contactId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "E.164 format, e.g. `+971501234567`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Replaces the contact's existing tags.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Key-value pairs to update. Existing keys not listed here are left unchanged.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantReply.updateContact({
      $,
      contactId: this.contactId,
      data: {
        display_name: this.displayName,
        phone: this.phone,
        email: this.email,
        tags: this.tags,
        custom_fields: this.customFields,
      },
    });
    $.export("$summary", `Contact ${this.contactId} updated`);
    return response;
  },
};
