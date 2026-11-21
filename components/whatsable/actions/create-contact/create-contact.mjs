import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Create or Find Contact",
  description: "Find a contact by phone or WhatsApp user ID, or create one with an optional name",
  key: "whatsable-create-contact",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    whatsable,
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone in international format. Use phone or WhatsApp user ID.",
      optional: true,
    },
    wa_user_id: {
      type: "string",
      label: "WhatsApp User ID",
      description: "Business-scoped WhatsApp user ID. Use phone or this ID.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Contact Name",
      description: "Name set on a newly created contact",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.phone && !this.wa_user_id) throw new Error("Provide either Phone Number or WhatsApp User ID.");
    const response = await this.whatsable.createContact({
      $,
      data: {
        ...(this.phone
          ? {
            phone: this.phone,
          }
          : {}),
        ...(this.wa_user_id
          ? {
            wa_user_id: this.wa_user_id,
          }
          : {}),
        ...(this.name
          ? {
            name: this.name,
          }
          : {}),
      },
    });
    $.export("$summary", "Found or created Whatsable contact");
    return response;
  },
};
