import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Create a new contact or update existing contact details in Ominiflow CRM",
  version: "0.0.1",
  type: "action",
  props: {
    ominiflow,
    phone: {
      type: "string",
      label: "Contact Phone Number",
      description: "WhatsApp phone number with country code (e.g. `+919876543210`).",
    },
    name: {
      type: "string",
      label: "Full Name",
      description: "Customer or lead full name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "Customer email address.",
      optional: true,
    },
    groupId: {
      propDefinition: [ominiflow, "groupId"],
    },
  },
  async run({ $ }) {
    const response = await this.ominiflow.createOrUpdateContact({
      $,
      phone: this.phone,
      name: this.name,
      email: this.email,
      groupId: this.groupId,
    });

    if (response?.status === "error") {
      throw new Error(`Ominiflow error: ${response.message || response.errors || "Failed to update contact"}`);
    }

    $.export("$summary", `Contact ${this.phone} updated successfully`);
    return response;
  },
};
