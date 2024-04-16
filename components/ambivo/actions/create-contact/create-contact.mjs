import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-create-contact",
  name: "Create or Update Contact",
  description: "Generates a new contact in the Ambivo database. If the contact already exists, it updates the contact.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ambivo,
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Details of the contact to be created or updated. Include fields such as name, email, phone, address, along with optional fields like notes or custom fields.",
    },
  },
  async run({ $ }) {
    const response = await this.ambivo.createOrUpdateContact(this.contactDetails);
    $.export("$summary", "Successfully created or updated contact");
    return response;
  },
};
