import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in SuiteDash. [See the documentation](https://app.suitedash.com/secure-api/swagger)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    suitedash,
    contactFirstName: {
      ...suitedash.propDefinitions.contactFirstName,
      description: "The first name of the new contact.",
    },
    contactLastName: {
      ...suitedash.propDefinitions.contactLastName,
      description: "The last name of the new contact.",
    },
    contactEmail: {
      ...suitedash.propDefinitions.contactEmail,
      description: "The email of the new contact.",
    },
    contactRole: {
      ...suitedash.propDefinitions.contactRole,
      description: "The role of the new contact.",
      optional: true,
    },
    sendWelcomeEmail: {
      ...suitedash.propDefinitions.sendWelcomeEmail,
      description: "Whether to send a welcome email to the new contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.suitedash.createContact({
      data: {
        contactFirstName: this.contactFirstName,
        contactLastName: this.contactLastName,
        contactEmail: this.contactEmail,
        contactRole: this.contactRole,
        sendWelcomeEmail: this.sendWelcomeEmail,
      },
    });
    $.export("$summary", `Successfully created contact ${this.contactFirstName} ${this.contactLastName}`);
    return response;
  },
};
