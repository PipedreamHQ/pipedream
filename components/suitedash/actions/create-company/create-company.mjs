import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-create-company",
  name: "Create Company",
  description: "Creates a new company in SuiteDash. [See the documentation](https://app.suitedash.com/secure-api/swagger)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    suitedash,
    companyName: {
      propDefinition: [
        suitedash,
        "companyName",
      ],
    },
    companyRole: {
      propDefinition: [
        suitedash,
        "role",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the company's primary contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the company's primary contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the company's primary contact",
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description: "Send welcome email to the primary contact. Default: `false`",
      optional: true,
      default: false,
    },
    createPrimaryContactIfNotExists: {
      type: "boolean",
      label: "Create Primary Contact If Not Exists",
      description: "Create a Primary Contact with all provided data if the email does not exist. Default: `true`",
      optional: true,
      default: true,
    },
    preventIndividualMode: {
      type: "boolean",
      label: "Prevent Individual Mode",
      description: "Prevent this Primary Contact from switching into `Individual Mode`. Default: `false`",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.suitedash.createCompany({
      $,
      data: {
        name: this.companyName,
        role: this.companyRole,
        primaryContact: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          send_welcome_email: this.sendWelcomeEmail,
          create_primary_contact_if_not_exists: this.createPrimaryContactIfNotExists,
          prevent_individual_mode: this.preventIndividualMode,
        },
      },
    });
    $.export("$summary", `Successfully created company ${this.companyName}`);
    return response;
  },
};
