import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-create-contact",
  name: "Create Contact",
  description: "Create a new contact in your Instant Reply inbox. Use this to sync leads from forms, CRMs, or any trigger into Instant Reply. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The contact's full name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "WhatsApp-compatible phone number in E.164 format, e.g. `+971501234567`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
    },
    instagramUsername: {
      type: "string",
      label: "Instagram Username",
      description: "Without the @ symbol.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to apply to the contact for segmentation.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Any additional key-value pairs to store on the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantReply.createContact({
      $,
      data: {
        display_name: this.displayName,
        phone: this.phone,
        email: this.email,
        instagram_username: this.instagramUsername,
        tags: this.tags,
        custom_fields: this.customFields,
      },
    });
    $.export("$summary", `Contact created: ${this.displayName || this.phone || this.email || response?.id}`);
    return response;
  },
};
