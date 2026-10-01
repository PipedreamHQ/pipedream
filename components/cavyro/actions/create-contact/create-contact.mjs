import { ConfigurationError } from "@pipedream/platform";
import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Cavyro, optionally linked to a company. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    cavyro,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name. Provide a first name, a last name, or both.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address. Must be unique in the workspace.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number, e.g. `+381601234567`.",
      optional: true,
    },
    telegram: {
      type: "string",
      label: "Telegram Username",
      description: "The contact's Telegram username, without the `@`.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "The contact's job title.",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The contact's LinkedIn profile URL.",
      optional: true,
    },
    description: {
      propDefinition: [
        cavyro,
        "description",
      ],
    },
    companyId: {
      propDefinition: [
        cavyro,
        "companyId",
      ],
    },
    customFields: {
      propDefinition: [
        cavyro,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    if (!this.firstName && !this.lastName) {
      throw new ConfigurationError("Provide a first name or a last name.");
    }
    const contact = await this.cavyro.createContact({
      $,
      data: {
        contact: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone: this.phone,
          telegram: this.telegram,
          title: this.title,
          linkedin: this.linkedin,
          description: this.description,
          custom_fields: this.customFields,
        },
      },
    });
    if (this.companyId) {
      await this.cavyro.linkContactToCompany({
        $,
        contactId: contact.id,
        data: {
          company_contact: {
            company_id: this.companyId,
          },
        },
      });
    }
    $.export("$summary", `Created contact ${contact.id}: ${contact.full_name}`);
    return contact;
  },
};
