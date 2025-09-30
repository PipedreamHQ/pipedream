import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in SuiteDash. [See the documentation](https://app.suitedash.com/secure-api/swagger)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    suitedash,
    firstName: {
      type: "string",
      label: "Contact First Name",
      description: "The first name of the new contact",
    },
    lastName: {
      type: "string",
      label: "Contact Last Name",
      description: "The last name of the new contact",
    },
    email: {
      type: "string",
      label: "Contact Email",
      description: "The email of the new contact",
    },
    role: {
      propDefinition: [
        suitedash,
        "role",
      ],
      label: "Contact Role",
      description: "The role of the new contact",
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description: "Whether to send a welcome email to the new contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.suitedash.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        role: this.role,
        send_welcome_email: this.sendWelcomeEmail,
      },
    });
    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}`);
    return response;
  },
};
