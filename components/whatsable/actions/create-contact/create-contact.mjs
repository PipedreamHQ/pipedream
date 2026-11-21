import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Create Contact",
  description: "Create a new contact in Whatsable",
  key: "whatsable-create-contact",
  version: "0.0.1",
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
      description: "Contact phone number in international format",
    },
    name: {
      type: "string",
      label: "Contact Name",
      description: "The contact's display name, e.g. `John Smith`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address, e.g. `john@example.com`.",
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable.createContact({
      $,
      data: {
        phone: this.phone,
        ...(this.name
          ? {
            name: this.name,
          }
          : {}),
        ...(this.email
          ? {
            email: this.email,
          }
          : {}),
      },
    });

    $.export("$summary", `Created contact ${this.phone}`);

    return response;
  },
};
